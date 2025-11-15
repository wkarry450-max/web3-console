import ReactECharts from 'echarts-for-react';
import { ChartData } from '../types';
import './Charts.css';

interface ChartsProps {
  chartData: ChartData[];
  transactions: any[];
}

export const Charts = ({ chartData, transactions }: ChartsProps) => {
  // 折线图配置
  const lineChartOption = {
    backgroundColor: 'transparent',
    textStyle: {
      color: 'var(--text-primary)',
    },
    title: {
      text: '交易金额趋势',
      left: 'center',
      textStyle: {
        color: 'var(--text-primary)',
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'var(--bg-secondary)',
      borderColor: 'var(--border-color)',
      textStyle: {
        color: 'var(--text-primary)',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.map(d => d.date),
      axisLine: {
        lineStyle: {
          color: 'var(--border-color)',
        },
      },
      axisLabel: {
        color: 'var(--text-secondary)',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'var(--border-color)',
        },
      },
      axisLabel: {
        color: 'var(--text-secondary)',
        formatter: '{value} ETH',
      },
      splitLine: {
        lineStyle: {
          color: 'var(--border-color)',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: '交易金额',
        type: 'line',
        smooth: true,
        data: chartData.map(d => d.value),
        itemStyle: {
          color: '#6366f1',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0.05)' },
            ],
          },
        },
        lineStyle: {
          width: 3,
        },
      },
    ],
  };

  // 热力图配置
  const heatmapData: any[] = [];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  // 生成模拟热力图数据
  transactions.forEach(tx => {
    const date = new Date(tx.timestamp);
    const day = date.getDay() === 0 ? 6 : date.getDay() - 1;
    const hour = date.getHours();
    const existing = heatmapData.find(d => d[0] === day && d[1] === hour);
    if (existing) {
      existing[2] += 1;
    } else {
      heatmapData.push([day, hour, 1]);
    }
  });

  const heatmapOption = {
    backgroundColor: 'transparent',
    textStyle: {
      color: 'var(--text-primary)',
    },
    title: {
      text: '交易活动热力图',
      left: 'center',
      textStyle: {
        color: 'var(--text-primary)',
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      position: 'top',
      backgroundColor: 'var(--bg-secondary)',
      borderColor: 'var(--border-color)',
      textStyle: {
        color: 'var(--text-primary)',
      },
      formatter: (params: any) => {
        return `${days[params.data[0]]} ${params.data[1]}:00<br/>交易数: ${params.data[2]}`;
      },
    },
    grid: {
      height: '50%',
      top: '10%',
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: {
        show: true,
      },
      axisLine: {
        lineStyle: {
          color: 'var(--border-color)',
        },
      },
      axisLabel: {
        color: 'var(--text-secondary)',
      },
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: {
        show: true,
      },
      axisLine: {
        lineStyle: {
          color: 'var(--border-color)',
        },
      },
      axisLabel: {
        color: 'var(--text-secondary)',
      },
    },
    visualMap: {
      min: 0,
      max: Math.max(...heatmapData.map(d => d[2]), 1),
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      inRange: {
        color: ['#e0e7ff', '#6366f1', '#4f46e5'],
      },
      textStyle: {
        color: 'var(--text-primary)',
      },
    },
    series: [
      {
        name: '交易数',
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true,
          color: 'var(--text-primary)',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <div className="charts-container">
      <div className="chart-wrapper">
        <ReactECharts
          option={lineChartOption}
          style={{ height: '300px', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
      <div className="chart-wrapper">
        <ReactECharts
          option={heatmapOption}
          style={{ height: '300px', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
};

