// Define the url as a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Call JSON url and console log the data
d3.json(url).then(function(data) {
  console.log(data);
});

// Function to initialize dashboard
function init() {

    // D3 for dropdown menu and populate the dropdown with data
    let dropdownMenu = d3.select("#selDataset");
    d3.json(url).then((data) => {
        
        // Variable for names and add to the dropdown
        let names = data.names;
        names.forEach((id) => {

            // Log id and append values to dropdown
            console.log(id);
            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample and log the value
        let sample_one = names[0];
        console.log(sample_one);

        // Build plots for metadata and charts
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);

    });
};

// Function to to retrieve metadata info
function buildMetadata(sample) {
    d3.json(url).then((data) => {

        let metadata = data.metadata;

        // Filter result based on sample and log the values
        let value = metadata.filter(result => result.id == sample);
        console.log(value)

        // Get the first value
        let valueData = value[0];

        // Clear out sample metadata
        d3.select("#sample-metadata").html("");

        // Use Object and entries for each key and value pair to be added
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the key and value pairs as they are appended to the metadata
            console.log(key,value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Define function to build the bar chart
function buildBarChart(sample) {

    // Use D3 to retrieve all the data
    d3.json(url).then((data) => {
        // Access the sample data
        let sampleInfo = data.samples;
        // Filter samples based on result.id
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first value from the data
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data
        console.log(otu_ids,otu_labels,sample_values);

        // Use slice to find the top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Define the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Define the layout and title for the bar chart
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Use Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Define the function to build the bubble chart
function buildBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {   
        // Access the sample data
        let sampleInfo = data.samples;
        // Filter the sample data based on the result.id
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first data value
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data
        console.log(otu_ids,otu_labels,sample_values);
        
        // Define the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Define the layout and title for the bubble chart
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Use Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Define function that updates the dashboard when the sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Change the values in the metadata and chart functions
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
};

// Initialize function to reset
init();