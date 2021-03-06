"use strict";

//handles all error messages
var showError = function showError(message) {
  $(".error").text(message);
  $(".error").fadeIn(400);
};

//handles requests
var sendAjax = function sendAjax(action, data) {
  console.log(data);
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    dataType: "json",
    success: function success(result, status, xhr) {
      $(".error").fadeOut(400);

      window.location = result.redirect;
    },
    error: function error(xhr, status, _error) {
      console.log(xhr.responseText);
      var messageObj = JSON.parse(xhr.responseText);
      showError(messageObj.error);
    }
  });
};

var sendGenericAjax = function sendGenericAjax(method, action, data, callback) {
  $.ajax({
    cache: false,
    type: method,
    url: action,
    data: data,
    dataType: "json",
    success: callback,
    error: function error(xhr, status, _error2) {
      console.log(xhr.responseText);
      var messageObj = JSON.parse(xhr.responseText);

      showError(messageObj.error);
    }
  });
};

var fileUpload = function fileUpload(action, data) {
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    processData: false,
    contentType: false,
    success: function success(result, status, xhr) {
      $(".error").fadeOut(400);
      $(".success").fadeIn(200);

      setInterval(function () {
        window.location = result.redirect;
      }, 1200);
    },
    error: function error(xhr, status, _error3) {
      var messageObj = JSON.parse(xhr.responseText);

      showError(messageObj.error);
    }
  });
};
//handles clear board request
var clearBoard = function clearBoard(method, action, data, callback) {
  console.log(data);
  $.ajax({
    cache: false,
    type: method,
    url: action,
    data: data,
    dataType: "json",
    success: callback,
    error: function error(xhr, status, _error4) {
      var messageObj = JSON.parse(xhr.responseText);

      showError(messageObj.error);
    }
  });
};
