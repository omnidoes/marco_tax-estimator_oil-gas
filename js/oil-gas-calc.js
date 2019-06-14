(function(Vue) {

  var calculatorOilGas = new Vue({
    el: '#oil-gas-calculator',
    // instance state
    data: {
      config: {
        estimateYear: 2019
      },
      well_age: '',
      income: [
        { value: 10 },
        { value: 20 },
        { value: 30 }
      ],
      incomeAverage: 0,
      production_months: 0,
      estimated_appraised_value: 0,
      estimated_assessed_value: 0,
      estimated_property_tax: 0
    },
    computed: {
      incomeAverage: function() {
        var avg = 0;

        if( this.well_age === 'under3') {
          return this.income[0].value;
        }

        if( this.well_age === '3andover') {
          avg = avg + (this.income[0].value * 0.5);
          avg = avg + (this.income[1].value * 0.3333);
          avg = avg + (this.income[2].value * 0.1667);

          return avg;
        }
      },
      estimated_appraised_value_multiplier: function() {

        if (this.well_age === 'under3') {
          return 2.75;
        } else if (this.well_age === '3andover') {
          return 2.5;
        }
      },
      estimated_appraised_value: function() {
        var value = 0;
        var annualizedValue = (this.incomeAverage / this.production_months) * 12;

        if (this.well_age === 'under3') {
          value = annualizedValue * this.estimated_appraised_value_multiplier;
        } else if (this.well_age === '3andover') {
          value = this.incomeAverage * this.estimated_appraised_value_multiplier;
        }
        
        return (isNaN(value) || !isFinite(value) ? 0: value);
      },
      estimated_assessed_value: function() {
        return this.estimated_appraised_value * 0.6;
      },
      estimated_property_tax: function() {
        return this.estimated_assessed_value * 0.020336;
      },
    },
    methods: {
      formatCurrency(value) {
        // https://blog.tompawlak.org/number-currency-formatting-javascript
        return "$" + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
      }
    }
  });


})(Vue);