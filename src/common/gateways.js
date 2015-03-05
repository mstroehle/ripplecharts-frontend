angular.module('gateways', [])
.factory('gateways', function($http) {
    var original     = null;
    var userGateways = store.get('gateways');
  
    var promise = $http.get(API + '/gateways').success(function (data) {
      original = data;
      
      if (!userGateways) {
        userGateways = original;
        for (var currency in userGateways) {
          for (var i in userGateways[currency]) {
            if (userGateways[currency][i].featured) {
              userGateways[currency][i].selected = true;
            }
          }
        }
      }
    });
  
    var getCurrencies = function () {
      var currencies = [];
      currencies.push({
        currency  : "XRP",
        icon      : API + '/currencies/xrp.svg'
      });
      for (var currency in userGateways) {
        for (var i=0; i<userGateways[currency].length; i++) {
          if (userGateways[currency][i].selected === true) {
            currencies.push({
              currency : currency,
              icon     : API + '/currencies/'+ currency +'.svg'
            });
            break;
          }
        }
      }
      
      return currencies;
    };
  
    var getIssuers = function (currency, options) {
      var issuers = [ ];
      var normalized;
      
      if (!options) options = { };
      
      if (!userGateways[currency]) {
        return issuers;
      }
      
      for (var i in userGateways[currency]) {
        if (options.all || userGateways[currency][i].selected === true) {
          normalized = userGateways[currency][i].name.toLowerCase().replace(/\W/g, '');
          issuers.push({
            name     : userGateways[currency][i].name,
            account  : userGateways[currency][i].account,
            icon     : API + '/gateways/' + normalized + '/assets/logo.svg',
            featured : userGateways[currency][i].featured,
            selected : userGateways[currency][i].selected
          });
        }
      }
      
      return issuers;
    };

    return {
      promise       : promise,
      getCurrencies : getCurrencies,
      getIssuers    : getIssuers
    }
});