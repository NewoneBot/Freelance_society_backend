// utils/validateUserInput.js

export function validateUserInput(userInput) {
    const {
      firstname, lastname, email, password, role, company_name,
      country_code, number, alt_country_code, alt_number, country, state, city, zipcode,
      address1, address2, ult_parent_id, status, dob, no_of_calls, callback, gender, parent_id,
    } = userInput;
  
    const errors = {};
  
    if (!firstname || firstname.trim() === "") {
      errors.firstname = "First name is required.";
    }
  
    if (!email || email.trim() === "") {
      errors.email = "Email is required.";
    }
  
    if (!password || password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
  
    if (!company_name || company_name.trim() === "") {
      errors.company_name = "Company name is required.";
    }
  
    if (!number || number.toString().length !== 10) {
      errors.number = "Phone number must be 10 digits.";
    }
  
    if (!country || country.trim() === "") {
      errors.country = "Country is required.";
    }
  
    if (!state || state.trim() === "") {
      errors.state = "State is required.";
    }
  
    if (!city || city.trim() === "") {
      errors.city = "City is required.";
    }
  
    if (!address1 || address1.trim() === "") {
      errors.address1 = "Address 1 is required.";
    }
  
    return errors;
  }
  