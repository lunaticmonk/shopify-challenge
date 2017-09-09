'use strict';

const request = require('request');
let invalidCustomers = [];

request.get('https://backend-challenge-winter-2017.herokuapp.com/customers.json?page=1', function(error, res, body) {
  if (error) {
    console.log('Error: ', error);
  }
  let data = JSON.parse(body);
  let validations = data.validations;
  let customers = data.customers;
  let requiredValidations = [];

  validations.forEach(validation => {
    Object.keys(validation).map(validationKey => {
      if (validation[validationKey].required) {
        requiredValidations.push({
          'key'       : validationKey,
          'type'      : typeof(validationKey),
          'minLength' : validation[validationKey]['length'] ? validation[validationKey]['length']['min'] : null,
          'maxLength' : validation[validationKey]['length'] ? validation[validationKey]['length']['max'] : null
        });
      }
    });
  });

  customers.forEach(customer => {
    let invalidValidationPerUser = [];
    requiredValidations.forEach(validation => {
      if (customer[validation.key] === null) {
        invalidValidationPerUser.push(validation.key);
      }
      if (customer[validation.key] && (validation.minLength || validation.maxLength) && validation.type === typeof(customer[validation.key])) {
        let customerKeyLength = customer[validation.key].split('').length;
        if (!(customerKeyLength > validation.minLength || customerKeyLength <= validation.maxLength)) {
          invalidValidationPerUser.push(validation.key);
        }
        // if (!((customerKeyLength >= validation.minLength && customerKeyLength < validation.maxLength) || (customerKeyLength > validation.minLength) || (customerKeyLength < validation.maxLength))) {
        //   console.log((customerKeyLength >= validation.minLength && customerKeyLength < validation.maxLength));
        //   console.log(customerKeyLength, validation.minLength, validation.maxLength);
        //   // console.log(customer[validation.key].split('').length);
        //   // console.log(validation.minLength, validation.maxLength);
        //   invalidValidationPerUser.push(validation.key);
        // }
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
