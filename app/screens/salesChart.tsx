import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Text, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import fetchReceipts from '@/config/fetchReceipts';

const SalesChart: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('month');
  const [data, setData] = useState({
    labels: [] as string[],
    datasets: [{ data: [] as number[] }]
  });
  const [yAxisLabels, setYAxisLabels] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      const { productsCount, yAxisLabels } = await fetchReceipts(filterType);

      setData({
        labels: Object.keys(productsCount),
        datasets: [{ data: Object.values(productsCount).map(count => count * 39) }] // Multiply by 39 pesos
      });
      setYAxisLabels(yAxisLabels);
    };

    getData();
  }, [filterType]);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.max(screenWidth, data.labels.length * 100); // Ensure chart is wide enough for scrolling

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter:</Text>
        <Picker
          selectedValue={filterType}
          onValueChange={(itemValue) => setFilterType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Month" value="month" />
          <Picker.Item label="Day" value="day" />
          <Picker.Item label="Year" value="year" />
        </Picker>
      </View>

      <ScrollView horizontal>
        <BarChart
          data={data}
          width={chartWidth} // Set the width dynamically
          height={250}
          yAxisLabel='₱'
          yAxisSuffix=""
          yLabelsOffset={-5}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#fbfbfb",
            backgroundGradientTo: "#f0f0f0",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          verticalLabelRotation={0}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          fromZero
          showValuesOnTopOfBars
          yAxisInterval={100}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    paddingRight: 20,
  },
  filterLabel: {
    marginRight: 10,
  },
  picker: {
    height: 50,
    width: 150,
  }
});

export default SalesChart;
