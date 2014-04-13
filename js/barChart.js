$(document).ready(function(){

    //setup YTD budget bar chart options.
    var option_barchart = {
        chart: {
          renderTo: "YTD-bar",
          type: 'column'
        },
        title: {
          text: 'YTD Difference Between Actual Spending and Budget',
          x: -10,
          style: {
            fontSize: '12px'
          }
        },
        subtitle: {
            text: "using projected actual for Nov",
            x: -15,
            style: {
                fontSize: '10px'
            }
        },
        xAxis: {
          categories: [], //holder
          labels: {
                rotation: -45,
            }
        },
        yAxis: {
            max: 350,
            min: -350,
            tickInterval: 350,
            title: {
                text: 'Percentage (%)',
                style: {
                    fontSize: '9px'
                }
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: false,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        legend: {
            enabled: false,
        },
        series: []
      };

      //small budget chart

      var option_ytdBarChart ={
        chart: {
            renderTo: "ytd-budget-ref",
            type: "column"
        },
        title: {
            text: "Nov YTD Budget vs Actual",
            x: 25, //set it to center
            style: {
                fontSize: '14px'
            }
        },
        subtitle: {
            text: "using projected actual for Nov",
            x: 25,
            style: {
                fontSize: '12px'
            }
        },
        xAxis: {
            categories: [], //place holder
            labels: {
                rotation: -45,
            }
        },
        yAxis: {
            title: {
                text: "Budget ($)",
                style: {
                    fontSize: '10px',
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: "#191919",
            }],
            gridLineColor: "#ECECEA",
            tickInterval: 1000000
        },
        tooltip: {
            valuePreffix: "$",
            valueDecimals: 1,
        },
        legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle",
            itemStyle: {
                fontSize: '8px'
            },
            itemMarginTop: 5,
            floating: true,
            // y: 40,
            // enabled: false,
        },
        series: []
    };



      // get data

      $.get('_data/YTD_percent.csv', function(data){
            var lines = data.split("\n");

            var department_name = "YTD Percent";
            var department_data = [];

        $.each(lines, function(lineNo, line){
            var items = line.split(",");
            if (line!=="") {
                
                $.each(items, function(itemNo, item){
                    if (itemNo ===0){
                        switch(item){
                            case "Information Technology":
                                name = "IT";
                                break;
                            case "Technical Support": 
                                name = "TS";
                                break;
                            case "Human Resources":
                                name = "HR";
                                break;
                            default:
                                name = item;
                        }
                        option_barchart.xAxis.categories.push(name);
                    }
                    else{
                        department_data.push(parseFloat(item)*100);
                    }
                });
                
                console.log(option_barchart.xAxis.categories);
            }
        }); //end .each lines
        option_barchart.series.push({
            name: department_name,
            data: department_data,
            
        });

        var chart = new Highcharts.Chart(option_barchart);
    }); //end .get


    //get ytd budget bar chart data
    $.get("_data/ytd_nov_budget.csv", function(data){
        var lines = data.split("\r");

        budget = {
            type: "column",
            name: "Budget",
            data:[]
        };
        actual = {
            type: "scatter",
            color: 'red',
            name: "Actual",
            data:[]
        };
        $.each(lines, function(lineNo, line){
            // console.log(lineNo, line);
            items = line.split(",");
                $.each(items, function(itemNo, item){
                    if (itemNo ===0){
                        switch(item){
                            case "Information Technology":
                                department_name = "IT";
                                break;
                            case "Technical Support":
                                department_name = "TS";
                                break;
                            case "Human Resources":
                                department_name = "HR";
                                break;
                            default:
                                department_name = item;
                        }
                        option_ytdBarChart.xAxis.categories.push(department_name);
                    }
                    else if (itemNo ==1) {
                        var val = parseInt(item) * 1000;
                        budget.data.push(val);
                    }
                    else{
                        var val = parseInt(item) * 1000;
                        actual.data.push(val);
                    }
                });
            });

            option_ytdBarChart.series.push(budget);
            option_ytdBarChart.series.push(actual);

        var chart = new Highcharts.Chart(option_ytdBarChart);
    }); //end .get ytd_nov_budget.csv


    //multi bar chart
    var trellisbarcharts = [],
        $containers = $('#multi-bar .bar'),
        datasets = [];
        var newcolor = ['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f','#bf5b17','#666666'];

    
    $.get("_data/month_percent.csv", function(data){
        var lines = data.split("\n");

        $.each(lines, function(lineNo, line){
            items = line.split(",");

            if(lineNo == 0){
                return;
            }

            else if (line!=""){
                var department_name = "";
                var department_data = [];
                $.each(items, function(itemNo, item){
                    if (itemNo ==0){
                        switch(item){
                            case "Information Technology":
                                department_name = "IT";
                                break;
                            case "Technical Support": 
                                department_name = "TS";
                                break;
                            case "Human Resources":
                                department_name = "HR";
                                break;
                            default:
                                department_name = item;
                        }
                    }
                    else{
                        department_data.push(parseFloat(item) * 100);
                    }
                });
                datasets.push({
                    name: department_name,
                    data: department_data,
                    color: newcolor[lineNo-1]
                });
                console.log(datasets);
            }
        }); //end .each lines

        $.each(datasets, function(i, dataset) {
                trellisbarcharts.push(new Highcharts.Chart({
                    chart: {
                        renderTo: $containers[i],
                        type: 'column',
                        marginBottom: i === 3 || i ===7 ? 20 : 10
                    },
                    title: {
                        text: null
                    },
                    title: {
                      text: i === 0 || i === 4 ? 'Monthly Difference Between Actual and Budget' : null,
                      x: -10,
                      style: {
                        fontSize: '12px'
                      },
                    },
                    subtitle: {
                        text: i === 0 || i === 4 ? "using projected actual for Nov" : null,
                        x: -15,
                        style: {
                            fontSize: '10px'
                        },
                    },
                    credits: {
                        enabled: false
                    },

                    xAxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
                        labels: {
                            enabled: i === 3 || i === 7
                        }
                    },

                    yAxis: {
                        allowDecimals: false,
                        title: {
                            text: i < 4 ? 'Percent (%)' : null,
                            style: {
                                fontSize: '9px'
                            }
                        },
                        // min: -35,
                        // max: 55,
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#000000',
                            zIndex: 5
                        }]
                    },

                    legend: {
                        layout: "vertical",
                        align: "right",
                        verticalAlign: "middle",
                        itemStyle: {
                            fontSize: '8px'
                        },
                        // floating: true,
                    },

                    series: [dataset]

                })); // end charts.push
        }); // end .each datasets
    }); //end .get
    
});