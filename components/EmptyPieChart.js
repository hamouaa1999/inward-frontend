import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import * as d3Shape from 'd3-shape';

const EmptyPieChart = ({ radius, strokeWidth, percentages = [100, 0, 0, 0, 0, 0] }) => {

  // Calculate the radius for the donut chart
  const innerRadius = radius - strokeWidth;
  
 

  // Create a pie chart generator
  const pie = d3Shape.pie().sort(null);

  // Generate pie chart data based on percentages
  const data = pie(percentages);

  // Define colors for the slices
   const colors = ['#dc2626', 'green', 'blue', 'black', '#fde047', '#fb923c']; 

  // Create SVG paths for each slice
  const slices = data.map((slice, index) => {
    const arc = d3Shape
      .arc()
      .outerRadius(radius)
      .innerRadius(innerRadius)
      .startAngle(slice.startAngle)
      .endAngle(slice.endAngle);

    return (
      <Path
        key={index}
        d={arc()}
        fill={colors[index]}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2}>
        <G transform={`translate(${radius},${radius})`}>
          {slices}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default EmptyPieChart;