"use client"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DemographicsChart from "@/components/demographics-chart"
import LoadingSpinner from "@/components/loading-spinner"
import AgeDistributionChart from "./age-bar-chart"
import AgeBarChart from "./age-bar-chart"
import TopStatsList from "./top-stats-list"
import USMapVisualization from "./usa-map"

export default function DemographicsSection() {
  return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
              <CardDescription>Gender breakdown of contestants</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <DemographicsChart type="gender" />
              </Suspense>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ethnicity Distribution</CardTitle>
              <CardDescription>Ethnic background of contestants</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <DemographicsChart type="ethnicity" />
              </Suspense>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Age Distribution</CardTitle>
              <CardDescription>Age distribution of contestants at start</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <AgeBarChart />
              </Suspense>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Most Common Professions</CardTitle>
              <CardDescription>Top 5 most common professions among all contestants</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <TopStatsList type="profession" count={10} />
              </Suspense>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Home States</CardTitle>
              <CardDescription>Where the contestants are from</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <USMapVisualization />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
