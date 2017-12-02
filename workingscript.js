var container = d3.select("body")
               .append("div")
               .attr('class', 'container')
               .attr('id', 'countryContainer')
               
var key = container
          .append('div')
               
var margin = {top: 10, right: 0, bottom: 14, left: 0},
    width = window.innerWidth/4 - margin.left - margin.right,
    height = window.innerHeight/4- margin.top - margin.bottom;
    
var unParsedData =[];
        
//Positive and Negative Bar Chart          
var x = d3.scaleLinear()
          .range([0,width]);
          
var y = d3.scaleBand()
          .rangeRound([height,0])
          .padding(0.3);
          
var colorArray = ["#0a97d9", "#e5243b", "#4c9f38", "#fcc30b", "#a21942", "3#b67721", "#56c02b"]

var z = d3.scaleOrdinal()
        // .range(d3.schemePaired);26bde2
          .range(["#4c9f38", "#a21942", "#0a97d9", "#e5243b", "#fd9d24", "#fcc30b"]); 
          
//Stacked Area Chart
var parseDate = d3.timeParse("%Y");

// d3.timeYears(1990, 2014[ 2]);

var classArrayForInteraction = [];
          
//This is an array of all the different income categories     
var objectKeys = [];

// Where I put my key value pairs of colors
var objectColors = []

    
//This is an array of ALL countries combined with their change listed              
    
        
function render(data, i){
        // console.log(data);
        
        //   data.Time = parseDate(data.Time);

    var allChangeArr = [];

        // Sort single country change from most cange to least change (postive and negative combined)
    objectKeys = objectKeys.sort(); // ['apples', 'bananas', 'cherries']

        
        
    var countryName = data[0]
                    .Country_Name;
   

                       
    
    var chartDiv = d3.select('body')
                 .append('div')
                 .attr('id', 'chartDiv'+ countryName)
                 .attr('class', 'chartDiv');;
    
     var titleDiv =  container
                    .append('div')
                    .attr('class', 'row')
                    
                    // .append('svg').attr('class', 'title')
                    // .attr("width", window.innerWidth)
                    // .attr('height', 30)
                    
                    
     var chartsRow = container
                    .append('div')
                    .attr('class', 'row')
                    
        
    var togglingTitle =  chartsRow
                            // .append("div")
                            // .attr("class","row")
                            .append('div')
    	
                            .attr('class','col-4')
                            .attr('id', "togglingTitle")
    // Make min and max of years
    var years = []

    for(var i=0; i<data.length; i++){
        years.push(data[i].Time)
    }

    var svgStacked = chartsRow
                    .append('div')
                    .attr('class','col-4')
                    .append('svg')
                    .attr('id', "svg" + countryName + "AreaChart")
                    .attr('width', window.innerWidth/4).attr('height', window.innerHeight/4),
                    
        marginStacked = {top: 24, right: 25, bottom: 30, left: 35},
        
        widthStacked = svgStacked.attr("width") - marginStacked.left - marginStacked.right,
        
        heightStacked = svgStacked.attr("height") - marginStacked.top - marginStacked.bottom;


    var xStacked = d3.scaleLinear().range([0, widthStacked]),
        yStacked = d3.scaleLinear().range([heightStacked, 0]);
    // zStacked = d3.scaleOrdinal(d3.schemeCategory10);

    var stack = d3.stack();

    var area = d3.area()
        .x(function(d, i) { return xStacked(d.data.Time); })
        .y0(function(d) { return yStacked(d[1]); })
        .y1(function(d) { return yStacked(d[0]); });

    var gStacked = d3.select("#svg"+countryName+ "AreaChart")
                .append("g")
                .attr("transform", "translate(" + marginStacked.left + "," + marginStacked.top + ")");
    
    
    
    xStacked.domain(d3.extent(data, function(d) { return d.Time; }));
    z.domain(objectKeys);
    stack.keys(objectKeys);

    var layer = gStacked.selectAll(".layer")
              .data(stack(data))
              .enter().append("g")
              .attr("class", "layer");

    layer.append("path")
      .attr("class", function(d,i){
          return objectKeys[i]
      })
      .style("fill", function(d) { return z(d); })
      .style("stroke",function(d) { return z(d); })
      .attr("d", area);
      


     //CREATE CHANGE ARRAY FOR BAR CHART AND TEXT 
    var singleCountryChange = [];
        
    var countryClass = data[0].Country_Name
    
        
    ////takes year value of data and tests if it's greater than or less than previous year. 
    function posOrNegChange (input){
         if (data[0][input] <= data[data.length-1][input]){
         return 100-data[0][input]/data[data.length-1][input]*100
         } else { return (100-data[data.length-1][input]/data[0][input]*100)*-1
         }
    }
        
        
        //making an object for cange in each category of income for each country between two Pushing to 1. country array 2. complete array
    objectKeys.forEach(function(d){
         
        var changeObj = new Object();
        changeObj.Country = data[0].Country_Name;
        changeObj.Category = d;
        changeObj.startYear = d3.min(years);
        changeObj.endYear = d3.max(years);
        changeObj.Change = posOrNegChange(d)
        singleCountryChange.push(changeObj)
        allChangeArr.push(changeObj)
    });

    
///////END CREATE CHANGE ARRAY

    var format = d3.format(".1f");


// //every year for every piece of data with value gets a tick

    gStacked.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + heightStacked + ")")
    //   .call(d3.axisBottom(xStacked).ticks(data.length).tickValues(years));
     .call(d3.axisBottom(xStacked).ticks(data.length).tickFormat(d3.format("d")).tickValues([years[0], d3.max(years)]));
    gStacked.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(yStacked).ticks(2, "%"));
 

///////////////END STACKED AREA CHART SVG CREATE///////////////////
        
    var svg = chartsRow
              .append('div')
              .attr('class','col-4')
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .attr("class", 'barChartSVG')
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


//adding mini chart titles
         svg
        .append("text")      // text label for the x axis
        .attr("class", "miniTitles")
        .attr("x", width/2 )
        .attr("y", 5)
        .style("text-anchor", "middle")
        .html("Neg. Change  &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  Pos. Change" );
        
         svgStacked
        .append("text")// text label for the x axis
        .attr("class", "miniTitles")
        .attr("x", width/2 )
        .attr("y", 13 )
        .style("text-anchor", "middle")
        .text("Income Shares" );
// /////////////////////data cleaned, create Pos NEG Bar Chart///////////////////////////////////////
        
    x.domain([-35, 35]);
    y.domain(allChangeArr.map(function(d) { return d.Category; }));
    
    svg.selectAll(".bar")
                .data(allChangeArr)
                .enter()
                
                .append("rect")
                .attr("class", function(d,i){
                    classArrayForInteraction.push(objectKeys[i])
                    return objectKeys[i]
                    }) 
                    					 .transition()

                .attr("x", function(d){
                    return d.Change < 0 ? x(d.Change) : x(0); 
                    })
    				.attr("width", function(d){
    				return d.Change < 0 ? x(d.Change * -1) - x(0) : x(d.Change) - x(0);
    				})
                .attr("y", function(d){ 
                    return y(d.Category); 
                    })
    			.attr("height", y.bandwidth())
    			.attr("fill", function(d) {  
                        for(var i=0; i<objectColors.length; i++){
            		         if(d.Category === objectColors[i].Category){
            		            return objectColors[i].color ;
            		         }
            			}    
    		    	})
 function increasedDecreased(positiveneg){ 
     if(positiveneg<0){
         return "decreased"
     } else {return "increased"};
 }
 
  function increaseDecreaseEquality(increasedordecreased, category){
     if (category == "something"){
         return("a decrease in equality")
     }
     
     
     
 }
 
 function parseClass(objectkey){ 
     return objectkey.replace('aIncome', "Income")
                 .replace('bIncome', "Income")
                 .replace('cIncome', "Income")
                 .replace('dIncome', "Income")
                 .replace('eIncome', "Income")
                 .replace('twenty', " quintile ")
                 .replace('by', " by the ")
                 .replace(/_/g, ' ')}    		    	
////Interactivity			        
togglingTitle
      .selectAll ('text')
      .data(allChangeArr)
      .enter()
      .append("text")
      .attr('class', function(d, i){return classArrayForInteraction[i]+"text"})
    //   .style("font", "10px sans-serif")
    //   .style("text-anchor", "end")
      
      .text(function(d, i) {
          var thisText = parseClass(objectKeys[i]) + increasedDecreased(allChangeArr[i].Change*1) + " from " + format(data[0][objectKeys[i]]*100) + " to " + format(data[years.length-1][objectKeys[i]]*100) + " percent" + ", a " + format(allChangeArr[i].Change) + " percent" +" change" + " representing" + increaseDecreaseEquality(increasedDecreased(allChangeArr[i].Change*1) , objectKeys[i]);
          return thisText;

      })
      .style("font-size", 0)
      .style("fill", "red")

var tempTitle = togglingTitle
                .data(data)
                .append("text")
                .attr("class","tempTitle")
                .text(function(d){ if (d.Country_Name == "Ghana"){return "Ghana represents countries that follow a downward equality trend"}})
                



  	svg.selectAll(".change")
					.data(allChangeArr)
					.enter().append("text")
					.attr("class", "change")
					.attr("x", function(d){
							if (d.Change < 0){
								return (x(d.Change * -1) - x(0)) > 20 ? x(d.Change) + 2 : x(d.Change) - 1;
							} else {
								return (x(d.Change) - x(0)) > 20 ? x(d.Change) - 2 : x(d.Change) + 1;
							}
						 })
						
					 .attr("y", function(d){ return y(d.Category); })
					 //change space inbetween bars
					 .attr("dy", y.bandwidth() - 2.55)
					 .attr("text-anchor", function(d){
							if (d.Change < 0){
								return (x(d.Change * -1) - x(0)) > 20 ? "start" : "end";
							} else {
								return (x(d.Change) - x(0)) > 20 ? "end" : "start";
							}
					    })
					  .style("fill", function(d){
							if (d.Change < 0){
								return (x(d.Change * -1) - x(0)) > 20 ? "#fff" : "#3a403d";
							} else {
								return (x(d.Change) - x(0)) > 20 ? "#fff" : "#3a403d";
							}
						})
						.attr("text-anchor", function(d){ if (d.Change<-3){return "beginning"}else{return "end"}})
				        // .text(function(d){ return format(d.Change)+"%"; });
					  .text(function(d){ return format(d.Change) + "%"; })
					  .attr('class', 'innerText')
					  .style("opacity", ".7")
                       
    
                    
                    svg.selectAll(".category")
						.data(allChangeArr)
					    .enter()
					    .append("text")
						.attr("class", "category")
						.attr("x", function(d){ return d.Change < 0 ? x(0) + 2.55 : x(0) - 2.55 })
						.attr("y", function(d){ return y(d.Category); })
						//change height between bars
						.attr("dy", y.bandwidth() - 2.55)
						.attr("text-anchor", "end")
				        // .text(function(d){ return format(d.Change)+"%"; });
						
						
					svg.append("line")
						.attr("x1", x(0))
						.attr("x2", x(0))
						.attr("y1", 0 + 15)
						.attr("y2", height - 15)
						.attr("stroke", "#c4c4c4")
						.attr("stroke-width", "1px");
///////////////////////Interactivity/////////////////////////////////////
// console.log(unParsedData)
///create main title content

        // togglingTitle
        // .append('text')
        // .attr('class', 'staticTitle')
        // .text(function(){return "Income quintile distribution in " + countryName.replace('_', ' ') + " from " + d3.min(years) + " to " + d3.max(years)})
        // .attr('alignment-baseline','hanging')


    function useClassForInteraction (){
        
       for(var i = 0; i < classArrayForInteraction.length; i++){
           
                 d3.selectAll('.'+ classArrayForInteraction[i])
                 
                 .on("mouseover", function(){
                  //this returns change info for tanzania  
                    //  for(var i =0; i<allChangeArr.length; i++){
                    //      if(allChangeArr[i].Category==this.className.baseVal){
  
                    //          console.log(allChangeArr[i].Change)
                    //      }
                    //  }

                     d3.select( "." + countryName + 'togglingTitle')
                    
                     .attr('alignment-baseline','hanging')

                    for(var j = 0; j < classArrayForInteraction.length; j++){
                            if(classArrayForInteraction[j] != this.className.baseVal){
                            d3.selectAll('.'+classArrayForInteraction[j]+"text").style("visibility", "hidden")    .style("fill", "red")
; 
                            d3.selectAll('.'+classArrayForInteraction[j]).transition()
                            .duration(200).style('opacity', 0.1 )
                            // .text("hello")
                            } else { d3.selectAll('.'+classArrayForInteraction[j]+"text").style("visibility", "visible") .style("font-size", 20);
                                
                                d3.selectAll('.'+"tempTitle").style("visibility", "hidden")
                                
                            } 
                     }
                     
                     
                     
        })
                .on("mouseout", function(){ 
                    d3.selectAll('svg')
                    // .selectAll("text").remove();
                    for(var j = 0; j < classArrayForInteraction.length; j++){
                        d3.selectAll('.'+classArrayForInteraction[j]+"text").style("font-size", 0)
                         d3.selectAll('.'+classArrayForInteraction[j]).style("font-size", 0)
                         d3.selectAll('.'+"tempTitle").style("visibility", "visible")
                         
                            d3.selectAll('.'+classArrayForInteraction[j])
                            .transition()
                            .duration(200)
                            .style('opacity', 1)
                     }

                 })
                     


        }

    };
    //Income quintile distribution 
    useClassForInteraction()
    
    titleDiv
        .append('div')
        .attr('class','col-4')
        .append('text')
        .attr('class', 'staticTitle')
        .text(function(){return countryName.replace('_', ' ') + " from " + d3.min(years) + " to " + d3.max(years)})
        .attr('alignment-baseline','hanging')
        
    }
    
    
    
    
    
    

    //LAYER INTERACTIVITY
    d3.csv ("data/wdidata.csv", type, function(error, data){
            // if (error) console.log(error);
        data.forEach(function(d){
            
        d.Time = +d.Time
           
    
        });
            
            
        var country1 = []
        var country2 = []
        var country3 = []
         

         //Create object Keys so I can send each numeric key through program
         
         function loopthroghObjectKeys(){
            var keys = Object.keys(data[0])
    
            for(var i=0; i<keys.length; i++){
            if(keys[i]!="Country_Name"&& keys[i]!="Time"&& keys[i]!="Country_Code"){

                    objectKeys.push(keys[i]);
                }
            } 
         }
         
        loopthroghObjectKeys();
        
        function createColorPairs (){ 
        for(var i = 0; i<colorArray.length; i++){
        var colorObject = new Object;
        colorObject.color = colorArray[i];
        colorObject.Category = objectKeys[i];
        objectColors.push(colorObject)
        }
        }
        
        createColorPairs ()
        
 
         // End Create Object Keys
         
         
        data.forEach(function(d){
            
        if (d.Country_Name == "Ghana" && d[objectKeys[3]]*1){
                country1.push(d)
                } else if (d.Country_Name == "Burkina_Faso"  && d[objectKeys[3]]*1){
                country2.push(d)
                } else if (d.Country_Name == "Tanzania"  && d[objectKeys[3]]*1){
                country3.push(d)
                }
            });  
            
        // d3.select('body')
        //     .data(objectKeys)
        //     .append('div')
        //     .attr('class', 'key')
        //     .append('rect')
            // .attr('color', function(d) { return z(d.length)})
        render(country2)
        render(country1)
        render(country3)
       
       
    
    
    
    /// make a different d3 select all for each item in array of classes
    /// when that thing is selected turn all instances of it black
    
    
    // var selectorOne = d3.selectAll(body)
    //       .on("mouseover", function(d,i){classArrayForInteraction[i].style("fill", "#000000");})
    });
    
    function type(d, i, columns) {
                     unParsedData.push(d)

  //This turns the year and stuff into integers
//   d.Time = parseDate(d.Time);
  for (var i = 2, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]]/100;
  return d;
}    
    
    

    

/// If I hover over THIS class, return THIS paragraph associated with this class
//fdsfd

