'use strict';

const request = require('request');
let invalidCustomers = [];

request.get('https://backend-challenge-winter-2017.herokuapp.com/customers.json?page=2', function(error, res, body) {
  if (error) {
    console.log('Error: ', error);
  }
  let data = JSON.parse(body);
  let validations = data.validations;
  let customers = data.customers;

  let requiredValidations = [];



  validations.forEach(validation => {
    Object.keys(validation).map(validationKey => {
      console.log(validation[validationKey].required);
      if (validation[validationKey].required) {
        requiredValidations.push(validationKey);
      }
    });
  });

  customers.forEach(customer => {
    let invalidValidationPerUser = [];
    requiredValidations.forEach(validationKey => {
      if (!customer[validationKey]) {
        invalidValidationPerUser.push(validationKey);
      }
    });
    if (invalidValidationPerUser.length) {
      invalidCustomers.push({
        "id": customer.id, "invalid_fields": invalidValidationPerUser
      });
    }
  });
  console.log(requiredValidations);
  console.log(invalidCustomers);
});
