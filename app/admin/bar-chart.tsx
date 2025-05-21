"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type PengaduanChart = {
  month: string;
  total_pengaduan: number;
  total_selesai: number;
};

const chartConfig = {
  total_pengaduan: {
    label: "Pengaduan Masuk",
    color: "hsl(var(--chart-1))",
  },
  total_selesai: {
    label: "Pengaduan Selesai",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function DashboardChart({ chartData }: { chartData: PengaduanChart[] }) {
  console.log(chartData);
  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Laporan Pengaduan Masuk/Selesai per Bulan</CardTitle>
        <CardDescription>1 Tahun terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="total_pengaduan" fill="#2563eb" radius={4} />
            <Bar dataKey="total_selesai" fill="#60a5fa" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Menampilkan data 1 tahun terakhir Tahun terakhir
        </div>
      </CardFooter>
    </Card>
  );
}
