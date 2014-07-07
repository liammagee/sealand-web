/**
 * A set of utility functions for dealing with records
 */

var RecordsManager = {};

(function() {
    this.records = [], this.selectRecords = [], this.analysedRecords = {};


    this.initialiseRecords = function(records) {
        this.records = this.selectRecords = records;
    }

    this.analyseRecords = function(level) {
        var that = this;
        that.analysedRecords = {}
        that.selectRecords.forEach(function(row) {
            // Generate the key
            var key = '';

            // Localidad
            if (level >= 2) {
                key += row.p_7;
                key += ', ';
            }

            // Partido/Municipio/Departamento
            if (level >= 1) {
                key += row.p_6;
                key += ', ';
            }

            // Provincia
            if (level >= 0) {
                key += row.p_5;
            }


            if (that.analysedRecords.hasOwnProperty(key)) {
                that.analysedRecords[key] += 1;
            }
            else {
                that.analysedRecords[key] = 1;
            }
        })

        return that.analysedRecords;
    };

}).apply(RecordsManager);


if (typeof exports !== "undefined")
    exports.RecordsManager = RecordsManager;
