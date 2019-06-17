(function(Vue) {

  var calculatorOilGas = new Vue({
    el: '#oil-gas-calculator',
    // instance state
    data: {
      config: {
        estimateYear: marco_ogtax_settings.estimateYear || 2019,
        historicalFactor: {
          lt3years: marco_ogtax_settings.histfactorlt3years || 2.75,
          egt3years: marco_ogtax_settings.histfactoregt3years || 2.5
        },
        appraisalRate: marco_ogtax_settings.appraisalRate || 0.6,
        levyRate: marco_ogtax_settings.levyRate || 0.020336
      },
      well_age: '',
      income: [
        { value: 0 },
        { value: 0 },
        { value: 0 }
      ],
      annualizedIncome: 0,
      incomeAverage: 0,
      production_months: 0,
      estimated_appraised_value: 0,
      estimated_assessed_value: 0,
      estimated_property_tax: 0
    },
    computed: {
      annualizedIncome: function() {
        var value = (this.incomeAverage / this.production_months) * 12;

        return (isNaN(value) || !isFinite(value) ? 0: value);
      },
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
          return this.config.historicalFactor.lt3years;
        } else if (this.well_age === '3andover') {
          return this.config.historicalFactor.egt3years;
        }
      },
      estimated_appraised_value: function() {
        var value = 0;

        if (this.well_age === 'under3') {
          value = this.annualizedIncome * this.estimated_appraised_value_multiplier;
        } else if (this.well_age === '3andover') {
          value = this.incomeAverage * this.estimated_appraised_value_multiplier;
        }

        return (isNaN(value) || !isFinite(value) ? 0: value);
      },
      estimated_assessed_value: function() {
        return this.estimated_appraised_value * this.config.appraisalRate;
      },
      estimated_property_tax: function() {
        return this.estimated_assessed_value * this.config.levyRate;
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