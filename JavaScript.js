$(document).ready(function () {

    /* ================================================ *
    *                   CALCULATOR			            *
    * ================================================= */
    var value1 = "";
    var value2 = "";
    var operator = "";
    var result = 0;

    var topDisplay = $("#topdisplay");
    topDisplay.text('');

    var bottomDisplay = $("#bottomdisplay");
    bottomDisplay.text('0');


    // retrieves text of num key entered and display on display
    $('.num').click(function () {
        value1 += $(this).text();
        bottomDisplay.text(value1);
    });

    $('#signop').click(function () {
        value1 = value1 * -1;
        bottomDisplay.text(value1);
    });

    // square root
    $('#sqrt').click(function () {
        value1n = parseFloat(value1);
        result = Math.sqrt(value1n);
        topDisplay.text($(this).text() + value1);
        bottomDisplay.text(result);
        value1 = "";
    });

    // + - * / ^
    $(".operator").not('#equal,#signop,#sqrt').click(function () {
        operator = $(this).text();
        topDisplay.text(value1 + " " + operator);
        bottomDisplay.text("");
        value2 = value1;
        value1 = "";
    });

    $("#equal").click(function () {

        // check values for incorrect syntax -!!!!!!!!!!!

        topDisplay.text(value2 + " " + operator + " " + value1);

        //determine decimal length
        function findLength(val) {
            var valLength = "";
            if (val != Math.floor(val)) {
                valLength = val.split('.')[1].length;
                return valLength;
            }
            else
                valLength = "0";
            return parseFloat(valLength);
        }
        var length1 = findLength(value1);
        var length2 = findLength(value2);

        valLength = (length1 > length2) ? length1 : length2;

        //value#numeric
        value1n = parseFloat(value1);
        value2n = parseFloat(value2);

        if (operator === '+') {
            result = value2n + value1n;
        } else if (operator === '-') {
            result = (value2n - value1n).toFixed(valLength);
        } else if (operator === '×') {
            result = value2n * value1n;
        } else if (operator === '÷') {
            result = value2n / value1n;
        } //÷
        else {
            result = Math.pow(value2n, value1n);
        }

        bottomDisplay.text(result);
        console.log(typeof result);

        value1 = "";
        value2 = "";
    });

    // Clear
    $('#clear').click(function () {
        value1 = "";
        value2 = "";
        bottomDisplay.text('0');
        topDisplay.empty();
    });

    /* ================================================ *
    *                   UNIT CONVERSION		            *
    * ================================================= */

    // define mapping
    var length = [
        { 'Id': 'm' , 'Property': [1.0, 'Meter (m)'] },
        { 'Id': 'cm', 'Property': [100, 'Centimeter (cm)'] },
        { 'Id': 'km', 'Property': [.001, 'Kilometer (km)'] },
        { 'Id': 'in', 'Property': [39.36996, 'Inch (in)'] },
        { 'Id': 'ft', 'Property': [3.28084, 'Foot (ft)'] },
        { 'Id': 'yd', 'Property': [1.09361, 'Yard (yd)'] },
        { 'Id': 'mi', 'Property': [0.000621371, 'Mile (mi)'] }
    ];
    var mass = [
        { 'Id': 'kg', 'Property': [1.0, 'Kilogram (kg)'] },
        { 'Id': 'g',  'Property': [1000, 'Gram (g)'] },
        { 'Id': 'oz', 'Property': [35.274, 'Ounce (oz)'] },
        { 'Id': 'lb', 'Property': [2.20462, 'Pound (lb)'] },
        { 'Id': 't' , 'Property': [0.00110231, 'Ton (t)'] }
    ];
    // need to fix calculation
    var temperature = [
        { 'Id': 'f', 'Property': [1.0, 'Farenheit (F)'] },
        { 'Id': 'c', 'Property': [1.0, 'Celcius (C)'] }
    ];
    var time = [
        { 'Id': 'd',   'Property': [1.0, 'Day (d)'] },
        { 'Id': 'h',   'Property': [24, 'Hour (h)'] },
        { 'Id': 'min', 'Property': [1440, 'Minute (min)'] },
        { 'Id': 'sec', 'Property': [86400, 'Second (sec)'] },
        { 'Id': 'w',   'Property': [0.142857, 'Week (w)'] },
        { 'Id': 'm',   'Property': [0.0328767, 'Month (m)'] },
        { 'Id': 'yr',  'Property': [0.00273973, 'Year (yr)'] }
    ];
    var volume = [
        { 'Id': 'l',   'Property': [1.0, 'Liter (L)'] },
        { 'Id': 'mL',  'Property': [1000, 'Milliliter (mL)'] },
        { 'Id': 'gal', 'Property': [0.264172, 'Gallon (gal)'] }
    ];



    // when user switches conversion type
    function appendOption(convert_type) {
        $.each(convert_type, function (i, item) {
            $("#fromUnit, #toUnit").append("<option value='" + item.Id + "'>" + item.Property[1] + "</option>");
        });
    }

    var type = $('#type');

    type.on('change', function () {
        $('#fromUnit, #toUnit').html('');
        $('#from, #to').val('');
        
        //for (var i = 0; i < document.getElementById("type").length; i++) {
        //    if ( type.find('option:selected').attr('id') == mapping.findIndex(i) ){
        //        appendOption(mapping[i]);
        //    }
        //}
        if (type.val() == "Mass") {
            appendOption(mass);
        } else if (type.val() == "Temperature") {
            appendOption(temperature);
        } else if (type.val() == "Time") {
            appendOption(time);
        } else if (type.val() == "Volume") {
            appendOption(volume);
        } else {
            appendOption(length);
        }
    });


    // Conversions
    // ex: yd to in: yd to base, base to in
    //               yd to base = inverse of base to yd

   // -------------------------------------------------------------------
    var mapping = [length, mass, temperature, time, volume];
    //console.log(mapping);
    // -------------------------------------------------------------------

    $('#convert_equal').click(function () {
        var fromUnit = document.getElementById("fromUnit").value;
        var toUnit = document.getElementById("toUnit").value; 

        var fromValue = parseFloat(document.getElementById("from").value);
        var toValue = 0;

        // length
        if ($('#type').val() == "Length") {
            var fromCoeff = length.filter(function (unit) {
                return unit.Id == fromUnit;
            }).map(function (unit) {
                return unit.Property[0];
            });

            var toCoeff = length.filter(function (unit) {
                return unit.Id == toUnit;
            }).map(function (unit) {
                return unit.Property[0];
            });
            toValue = fromValue * (1 / fromCoeff) * toCoeff;
        }
        // mass
        else if ($('#type').val() == "Mass") {
            var fromCoeff = mass.filter(function (unit) {
                return unit.Id == fromUnit;
            }).map(function (unit) {
                return unit.Property[0];
            });

            var toCoeff = mass.filter(function (unit) {
                return unit.Id == toUnit;
            }).map(function (unit) {
                return unit.Property[0];
            });
            toValue = fromValue * (1 / fromCoeff) * toCoeff;
        }
        // time
        else if ($('#type').val() == "Time") {
            var fromCoeff = time.filter(function (unit) {
                return unit.Id == fromUnit;
            }).map(function (unit) {
                return unit.Property[0];
            });

            var toCoeff = time.filter(function (unit) {
                return unit.Id == toUnit;
            }).map(function (unit) {
                return unit.Property[0];
                });
            // need to fix rounding for units
            toValue = (fromValue * (1 / fromCoeff) * toCoeff).toFixed(1);
        }
        // volume
        else if ($('#type').val() == "Volume") {
            var fromCoeff = volume.filter(function (unit) {
                return unit.Id == fromUnit;
            }).map(function (unit) {
                return unit.Property[0];
            });

            var toCoeff = volume.filter(function (unit) {
                return unit.Id == toUnit;
            }).map(function (unit) {
                return unit.Property[0];
            });
            toValue = fromValue * (1 / fromCoeff) * toCoeff;
        }
        // temp
        else {
            if (fromUnit == 'f') { toValue = (fromValue - 32) * 5 / 9; }
            else { toValue = (fromValue * 5 / 9) - 32; }
            console.log(typeof toValue);
            toValue = toValue.toFixed(1);
            console.log(typeof toValue);

        }
        $('#to').val(toValue);
    });


    /* ================ MAIN NAVIGATION ================ */

    var calculator = $('#calculator');
    var converter = $('#converter');
    var calcbutton = $('#calcbutton');
    var convertbutton = $('#convertbutton');

    calculator.show();
    converter.hide();

    calcbutton.click(function () {
        calculator.show();
        converter.hide();
        console.log("click");
    });
    convertbutton.click(function () {
        calculator.hide();
        converter.show();
        appendOption(length);
    });

}); // end of script






    /*function defineConvConst(c) {
        return function (a) {
            return a * c
        }
    }
    function defineConvTemp() {

    }
    var mappings = {
        'm' : ['cm', defineConvConst(100)], // function (a, c) { a * c } ], //a * (1 / 100)
        'm': ['dm', defineConvConst(10)], // function (a, c) { a * c } ], // a * (1 / 10)
        'm': ConstConversion('dm', 10),
        'lb': ['kg', defineConvConst(5)],
        'f': ['c', defineConvTemp(9 / 5 + 32)],
        'f': TempConversion('c', ...)
        'c' : ['f', helloUS(-32 * 5 / 9)]
    
    }
    class Conversion () {
        function execute(a) {
            return a
        }
    }
    class ConstConversion : Conversion (c) {
        this.c = c
        function execute(a) {
           return a * c
        }
    }
    class TempConversion : Conversion () {
        
    }

    function convert(a, b, v) {
        var conversion = mappings[a][b]
        conversion.execute(v)
    }
    

    function renderSourceUnits() {
        mappings.forEach(function (k, v) {
            $('dropdown1').setValu
            if (v.bidirectional()) {

            }
        }
    }
    function renderDestUnits() {
        mappings[sourceUnit].forEach(function (k, v) {
            $('dropdown2').setVal
        })
    } */


/* to do
+- sign --- must have a value before using
decimal / syntax error msg
clear - x
sqrt / x^2
*/


    //var type = [];
    //var unit = [];
    //var factor = [];

    //type[0] = "length";
    //unit[0] = ["meter (m)", "centimeter (cm)", "millimeter (mm)", "kilometer (km)",
    //    "inch (in)", "foot (ft)", "yard (yd)", "mile (mi)"];
    //factor[0] = [1, .01, .001, 1000, 39.3701, 3.28084, 1.09361, 0.000621371];

    //console.log(2 * (unit[1]*factor[1]));