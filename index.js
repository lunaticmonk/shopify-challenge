'use strict';

const request = require('request');
let invalidCustomers = [];

request.get('https://backend-challenge-winter-2017.herokuapp.com/customers.json?page=3', function(error, res, body) {
  if (error) {
    console.log('Error: ', error);
  }
  let data = JSON.parse(body);
  let validations = data.validations;
  let customers = data.customers;
  let requiredValidations = [];

  validations.forEach(validation => {
    Object.keys(validation).map(validationKey => {
      if (validation[validationKey].required || validation[validationKey]['length']) {
        requiredValidations.push(validationKey);
      }
    });
  });

  customers.forEach(customer => {
    let invalidValidationPerUser = [];
    requiredValidations.forEach(validationKey => {
      if (customer[validationKey] === null) {
        invalidValidationPerUser.push(validationKey);
      }
    });
    if (invalidValidationPerUser.length) {
      invalidCustomers.push({
        "id": customer.id, "invalid_fields": invalidValidationPerUser
      });
    }
  });
  console.log(invalidCustomers);
  // console.log({
  //   "invalid_customers": invalidCustomers
  // });
});
