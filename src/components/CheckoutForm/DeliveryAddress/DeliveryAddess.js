import React, { useState, useEffect } from "react";
import { stateData } from "../stateData";
import "./DeliveryAddress.css";

const DeliveryAddress = (props) => {
  const { stepStatus, addressDetails, onComplete, onEdit } = props;

  const [userData, setUserData] = useState({
    name: addressDetails ? addressDetails.name : "",
    flatNumber: addressDetails ? addressDetails.flatNumber : "",
    streetName: addressDetails ? addressDetails.streetName : "",
    locality: addressDetails ? addressDetails.locality : "",
    state: addressDetails ? addressDetails.state : (stateData.states[0] ? stateData.states[0].code : ""),
    city: addressDetails ? addressDetails.city : (stateData.states[0] && stateData.states[0].districts[0] ? stateData.states[0].districts[0].name : ""),
  });

  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userData.state) {
      const stateIndex = stateData.states.findIndex((x) => x.code === userData.state);
      if (stateIndex !== -1) {
        setIndex(stateIndex);
      }
    }
  }, [userData.state]);

  const handleChange = (input) => (e) => {
    const val = e.target.value;
    if (input === "state") {
      const stateIndex = stateData.states.findIndex((x) => x.code === val);
      const stateIndexValid = stateIndex !== -1 ? stateIndex : 0;
      setIndex(stateIndexValid);
      
      const defaultCity = stateData.states[stateIndexValid]?.districts[0]?.name || "";
      setUserData({
        ...userData,
        state: val,
        city: defaultCity
      });
      return;
    }

    setUserData({
      ...userData,
      [input]: input !== "name" ? val.replace(/ /g, "") : val,
    });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    setError("");

    const nameVal = userData.name.trim();
    const flatVal = userData.flatNumber.trim();
    const streetVal = userData.streetName.trim();
    const localityVal = userData.locality.trim();
    const stateVal = userData.state.trim();
    const cityVal = userData.city.trim();

    // Inclusive validation bounds checks (UX only)
    if (nameVal.length < 1 || nameVal.length > 100) {
      setError("Name length must be between 1 and 100 characters inclusive.");
      return;
    }

    const addressParts = [flatVal, streetVal, localityVal, cityVal, stateVal].filter(
      (part) => part && part.length > 0
    );
    const fullAddress = addressParts.join(", ");

    if (fullAddress.length < 5 || fullAddress.length > 500) {
      setError("Delivery address length must be between 5 and 500 characters inclusive.");
      return;
    }

    onComplete({
      name: nameVal,
      flatNumber: flatVal,
      streetName: streetVal,
      locality: localityVal,
      state: stateVal,
      city: cityVal,
    });
  };

  const stepClass =
    stepStatus === "complete"
      ? "checkout-step checkout-step--complete"
      : stepStatus === "active"
      ? "checkout-step checkout-step--active"
      : "checkout-step";

  return (
    <div className={stepClass}>
      <span className="checkout-step__number">2</span>
      <span className="checkout-step__name" data-test-id="delivery-address-title">
        Delivery Address
      </span>

      {stepStatus === "complete" && (
        <button
          onClick={onEdit}
          className="btn delivery_change-btn"
          data-test-id="address-change-button submit__btn"
        >
          Change
        </button>
      )}

      <div className="checkout-step__body">
        {stepStatus === "complete" && addressDetails ? (
          <div className="guest-address-summary" style={{ fontSize: "1.4rem", padding: "1rem 0", color: "#5a4b31" }}>
            <p style={{ margin: "0.5rem 0" }}>
              <strong>Name:</strong> {addressDetails.name}
            </p>
            <p style={{ margin: "0.5rem 0" }}>
              <strong>Address:</strong> {`${addressDetails.flatNumber}, ${addressDetails.streetName}, ${addressDetails.locality}, ${addressDetails.city}, ${addressDetails.state}`}
            </p>
          </div>
        ) : (
          <div className="new-delivery-address-wrapper">
            <form className="new-delivery-address" onSubmit={onFormSubmit}>
              <div className="new-delivery-address__form-sub">
                <div className="new-delivery-address__form-row">
                  <div>Name</div>
                  <div className="display--table full-width">
                    <div className="display--table-cell vertical-align--bottom">
                      <label htmlFor="name" className="new-delivery-address__label">
                        <input
                          type="text"
                          placeholder="First &amp; Last Name"
                          maxLength="100"
                          id="name"
                          onChange={handleChange("name")}
                          value={userData.name}
                          required
                          className="input new-delivery-address__name"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="new-delivery-address__form-row">
                  <label htmlFor="addressLine1" className="new-delivery-address__label">
                    <div>Flat / House / Office No.</div>
                    <input
                      type="text"
                      id="addressLine1"
                      onChange={handleChange("flatNumber")}
                      value={userData.flatNumber}
                      className="input"
                      required
                    />
                  </label>
                </div>
                <div className="new-delivery-address__form-row">
                  <label htmlFor="addressLine2" className="new-delivery-address__label">
                    <div>Street / Society / Office Name</div>
                    <input
                      type="text"
                      id="addressLine2"
                      onChange={handleChange("streetName")}
                      value={userData.streetName}
                      className="input"
                      required
                    />
                  </label>
                </div>
                <div className="new-delivery-address__form-row">
                  <label htmlFor="addressLine3" className="new-delivery-address__label">
                    <div>Locality</div>
                    <input
                      type="text"
                      id="addressLine3"
                      onChange={handleChange("locality")}
                      value={userData.locality}
                      className="input"
                      required
                    />
                  </label>
                </div>
                <div className="new-delivery-address__form-row">
                  <label htmlFor="addressLine4" className="new-delivery-address__label">
                    <div>State</div>
                    <select
                      id="addressLine4"
                      onChange={handleChange("state")}
                      value={userData.state}
                      className="input"
                      required
                    >
                      {stateData.states.map((state) => {
                        return (
                          <option value={state.code} key={state.code}>
                            {state.name}
                          </option>
                        );
                      })}
                    </select>
                  </label>
                </div>
                <div className="new-delivery-address__form-row">
                  <label htmlFor="addressLine5" className="new-delivery-address__label">
                    <div>City</div>
                    <select
                      id="addressLine5"
                      onChange={handleChange("city")}
                      value={userData.city}
                      className="input"
                      required
                    >
                      {stateData.states[index]?.districts.map((district) => {
                        return (
                          <option value={district.name} key={district.id}>
                            {district.name}
                          </option>
                        );
                      })}
                    </select>
                  </label>
                </div>
                {error && (
                  <div style={{ color: "#d9534f", fontSize: "1.3rem", margin: "1rem 0", fontWeight: "500" }}>
                    {error}
                  </div>
                )}
                <div>
                  <button
                    className="btn new-delivery-address__btn flush--left submit__btn"
                    type="submit"
                    disabled={
                      !userData.name ||
                      !userData.flatNumber ||
                      !userData.streetName ||
                      !userData.locality ||
                      !userData.state ||
                      !userData.city
                    }
                  >
                    Continue
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryAddress;
