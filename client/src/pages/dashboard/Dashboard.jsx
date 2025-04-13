import Chart from "react-apexcharts";
import {
  AiFillProduct,
  AiOutlineArrowDown,
  AiOutlineArrowRight,
  AiOutlineArrowUp,
} from "react-icons/ai";
import { BsBoxSeam, BsBuilding } from "react-icons/bs";
import { useState } from "react";
import { TbCurrencyPeso } from "react-icons/tb";
import { useFetchListings } from "../../hooks/useFetchListing";
import { useFetchStocks } from "../../hooks/useFetchStocks";
import { useMemo } from "react";
import { useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const { listings, loading: listingsLoading } = useFetchListings();
  const { stocks, loading: stocksLoading } = useFetchStocks();

  /* TOP 5 DEMAND FORECAST */
  const [topDemandItems, setTopDemandItems] = useState({});
  const [topDemandLoading, setTopDemandLoading] = useState(true);

  /* FORECAST DATA */
  const [forecastData, setForecastData] = useState({});
  const [forecastLoading, setForecastLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Surgical Mask"); 

  const fetchForecastData = async () => {
    try {
      setForecastLoading(true);
      const response = await axios.get("http://localhost:5000/forecast_demand");
      setForecastData(response.data);

      if (
        Object.keys(response.data).length > 0 &&
        !response.data[selectedItem]
      ) {
        setSelectedItem(Object.keys(response.data)[0]);
      }

      setForecastLoading(false);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
      setForecastLoading(false);
    }
  };

  useEffect(() => {
    fetchForecastData();
  }, []); 

 const fetchTopDemandItems = async () => {
    try {
      setTopDemandLoading(true);
      const response = await axios.get(
        "http://localhost:5000/monthly_top_demands"
      );
      setTopDemandItems(response.data);
      setTopDemandLoading(false);
    } catch (error) {
      console.error("Error fetching top demand items:", error);
      setTopDemandLoading(false);
    }
  };

  useEffect(() => {
    fetchTopDemandItems();
  }, []);

  useEffect(() => {
    fetchTopDemandItems();
  }, []); 

  const inventoryItems = listings;

  const lowStockItems = inventoryItems.filter(
    (item) => item.quantity < 10
  ).length;
  const moderateStockItems = inventoryItems.filter(
    (item) => item.quantity >= 10 && item.quantity <= 50
  ).length;
  const highStockItems = inventoryItems.filter(
    (item) => item.quantity > 50
  ).length;


  const totalItems = inventoryItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const totalValue = stocks.reduce(
    (acc, item) => acc + item.quantity * item.unitCost,
    0
  );

  const countUniqueSuppliers = (stocks) => {
    if (!stocks || !stocks.length) return 0;

    const uniqueSuppliers = new Set(
      stocks.map((stock) => stock.supplier?.name).filter(Boolean)
    );

    return uniqueSuppliers.size;
  };

  // ABC Analysis Data
  const abcAnalysisData = useMemo(() => {
    // Calculate totals per category
    const categoryA = listings.filter(
      (item) => item.abcCategory === "A"
    ).length;
    const categoryB = listings.filter(
      (item) => item.abcCategory === "B"
    ).length;
    const categoryC = listings.filter(
      (item) => item.abcCategory === "C"
    ).length;

    return {
      series: [categoryA, categoryB, categoryC],
      options: {
        chart: {
          type: "pie",
        },
        labels: ["Category A", "Category B", "Category C"],
        colors: ["#3B82F6", "#8B5CF6", "#6B7280"],
        legend: {
          position: "bottom",
        },
        title: {
          text: "ABC Analysis Distribution",
          align: "center",
        },
      },
    };
  }, [listings]);

  const forecastRankingData = useMemo(() => {
    if (topDemandLoading || Object.keys(topDemandItems).length === 0) {
      return {
        series: [
          {
            name: "Forecasted Demand",
            data: [0, 0, 0, 0, 0],
          },
        ],
        options: {
          chart: { type: "bar" },
          plotOptions: { bar: { horizontal: true } },
          xaxis: { categories: ["Loading..."] },
          title: { text: "Top 5 Items by Forecasted Demand", align: "center" },
        },
      };
    }

    // Sort items by demand value (descending)
    const sortedItems = Object.entries(topDemandItems)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      series: [
        {
          name: "Forecasted Demand",
          data: sortedItems.map((item) => item[1]),
        },
      ],
      options: {
        chart: { type: "bar" },
        plotOptions: { bar: { horizontal: true } },
        xaxis: {
          categories: sortedItems.map((item) => item[0]),
        },
        title: {
          text: "Top 5 Items by Forecasted Demand",
          align: "center",
        },
      },
    };
  }, [topDemandItems, topDemandLoading]);

  const demandForecastData = useMemo(() => {
    if (
      forecastLoading ||
      Object.keys(forecastData).length === 0 ||
      !forecastData[selectedItem]
    ) {
      return {
        series: [
          {
            name: "Historical Demand",
            data: [0, 0, 0, 0, 0, 0],
          },
          {
            name: "Forecasted Demand",
            data: [null, null, null, null, null, 0, 0, 0, 0, 0, 0],
          },
        ],
        options: {
          chart: {
            type: "area",
            toolbar: {
              show: true,
              offsetY: 30,
            },
            height: 400,
            parentHeightOffset: 0,
          },
          dataLabels: { enabled: false },
          stroke: { curve: "smooth" },
          xaxis: {
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
            ],
            title: { text: "Month" },
          },
          yaxis: { title: { text: "Quantity" } },
          title: { text: "Demand Forecast - Loading...", align: "center" },
          tooltip: { x: { format: "MMM" } },
        },
      };
    }

    // Get data for the selected item
    const itemData = forecastData[selectedItem];
    const previousDemand = itemData.previousDemand || [];
    const forecast = itemData.forecast || [];

    // Create months array based on data length
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const months = [];

    // Generate last n months (for historical data)
    for (let i = previousDemand.length - 1; i >= 0; i--) {
      const monthIndex = (currentMonth - i) % 12;
      const monthName = new Date(0, monthIndex).toLocaleString("default", {
        month: "short",
      });
      months.push(monthName);
    }

    // Generate next n months (for forecast data)
    for (let i = 0; i < forecast.length; i++) {
      const monthIndex = (currentMonth + i + 1) % 12;
      const monthName = new Date(0, monthIndex).toLocaleString("default", {
        month: "short",
      });
      months.push(monthName);
    }

    const previousDemandSeries = [
      ...previousDemand,
      ...Array(forecast.length).fill(null),
    ];

    const forecastDataSeries = [
      ...Array(previousDemand.length).fill(null),
      ...forecast,
    ];

    return {
      series: [
        {
          name: "Previous Demand",
          data: previousDemandSeries,
          type: "line",
        },
        {
          name: "Forecasted Demand",
          data: forecastDataSeries,
          type: "line",
        },
      ],
      options: {
        chart: {
          type: "line",
          toolbar: {
            show: true,
            offsetY: 22,
          },
          height: 400,
          parentHeightOffset: 0,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: [3, 3],
          dashArray: [0, 0], 
        },
        colors: ["#008FFB", "#00E396"], 
        grid: {
          padding: {
            left: 15,
            right: 15,
          },
        },
        xaxis: {
          categories: months,
          title: { text: "Month" },
        },
        yaxis: {
          title: { text: "Quantity" },
          labels: {
            formatter: function (val) {
              // Format large numbers with K/M suffix for better readability
              if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
              if (val >= 1000) return (val / 1000).toFixed(1) + "K";
              return val.toFixed(0);
            },
          },
          tickAmount: 6,
        },
        title: { text: `Demand Forecast - ${selectedItem}`, align: "center" },
        tooltip: {
          x: { format: "MMM" },
          y: {
            formatter: function (value) {
              return value ? value.toFixed(2) : "";
            },
          },
          shared: true,
          intersect: false,
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
        },
        fill: {
          opacity: 0.7,
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
          },
        },
      },
    };
  }, [forecastData, selectedItem, forecastLoading]);

  const currencyFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* First Card - Inventory Overview */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Inventory Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
              <div className="flex items-center">
                <BsBoxSeam className="ml-2 w-6 h-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-xl font-bold">
                    {totalItems.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between bg-green-50 p-3 rounded">
              <div className="flex items-center">
                <TbCurrencyPeso className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-xl font-bold">
                    {currencyFormatter.format(totalValue)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between bg-indigo-50 p-3 rounded">
              <div className="flex items-center">
                <BsBuilding className="ml-1 w-6 h-6 text-indigo-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Suppliers</p>
                  <p className="text-xl font-bold">
                    {countUniqueSuppliers(stocks)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Second Card - Stock Levels */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Stock Levels
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-red-50 p-3 rounded">
              <div className="flex items-center">
                <AiOutlineArrowDown className="w-6 h-6 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-xl font-bold">{lowStockItems}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between bg-yellow-50 p-3 rounded">
              <div className="flex items-center">
                <AiOutlineArrowRight className="w-6 h-6 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Moderate</p>
                  <p className="text-xl font-bold">{moderateStockItems}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between bg-green-50 p-3 rounded">
              <div className="flex items-center">
                <AiOutlineArrowUp className="w-6 h-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">High Stock</p>
                  <p className="text-xl font-bold">{highStockItems}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Third Card - ABC Analysis */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            ABC Analysis
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
              <div className="flex items-center">
                <AiFillProduct className="w-6 h-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Category A</p>
                  <p className="text-xl font-bold">
                    {abcAnalysisData.series[0]}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded">
              <div className="flex items-center">
                <AiFillProduct className="w-6 h-6 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Category B</p>
                  <p className="text-xl font-bold">
                    {abcAnalysisData.series[1]}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
              <div className="flex items-center">
                <AiFillProduct className="w-6 h-6 text-gray-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Category C</p>
                  <p className="text-xl font-bold">
                    {abcAnalysisData.series[2]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow">
          <Chart
            options={abcAnalysisData.options}
            series={abcAnalysisData.series}
            type="pie"
            height={350}
          />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <Chart
            options={forecastRankingData.options}
            series={forecastRankingData.series}
            type="bar"
            height={350}
          />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">Demand Forecast</h3>
            <select
              className="border rounded p-1"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              disabled={forecastLoading}
            >
              {Object.keys(forecastData).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <Chart
            options={demandForecastData.options}
            series={demandForecastData.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
