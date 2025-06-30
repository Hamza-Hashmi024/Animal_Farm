
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  Scale, 
  DollarSign,
  Beef,
  AlertTriangle,
  Users,
  MapPin
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Reports = () => {
  const reportCategories = [
    {
      title: "Performance Reports",
      icon: TrendingUp,
      reports: [
        { name: "Weight Gain Analysis", description: "Detailed weight performance by farm and animal", lastGenerated: "2025-06-29" },
        { name: "ADG Comparison", description: "Average daily gain comparison across farms", lastGenerated: "2025-06-28" },
        { name: "Low Performers", description: "Animals underperforming growth targets", lastGenerated: "2025-06-29" },
      ]
    },
    {
      title: "Health & Vaccination Reports",
      icon: AlertTriangle,
      reports: [
        { name: "Vaccination Schedule", description: "Upcoming and overdue vaccinations", lastGenerated: "2025-06-29" },
        { name: "Incident Summary", description: "Health incidents and treatment records", lastGenerated: "2025-06-28" },
        { name: "Quarantine Report", description: "Animals in quarantine with reasons", lastGenerated: "2025-06-27" },
      ]
    },
    {
      title: "Financial Reports",
      icon: DollarSign,
      reports: [
        { name: "Investment Analysis", description: "ROI analysis by investor and farm", lastGenerated: "2025-06-29" },
        { name: "Feed Cost Analysis", description: "Feed expenses and cost per kg gain", lastGenerated: "2025-06-28" },
        { name: "Slaughter Revenue", description: "Revenue from slaughter operations", lastGenerated: "2025-06-27" },
      ]
    },
    {
      title: "Operational Reports",
      icon: BarChart3,
      reports: [
        { name: "Farm Capacity", description: "Current capacity utilization by farm", lastGenerated: "2025-06-29" },
        { name: "Inventory Report", description: "Current animal inventory across all farms", lastGenerated: "2025-06-29" },
        { name: "Slaughter Schedule", description: "Planned slaughter operations", lastGenerated: "2025-06-28" },
      ]
    }
  ];

  const quickStats = [
    { label: "Total Reports Generated", value: "847", icon: BarChart3 },
    { label: "Automated Reports", value: "23", icon: Calendar },
    { label: "Active Farms", value: "12", icon: MapPin },
    { label: "Total Animals", value: "1,247", icon: Scale },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <DashboardHeader />
          
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-600 mt-1">Generate and view comprehensive livestock management reports</p>
              </div>
              <div className="flex items-center space-x-3">
                <Select defaultValue="last-30-days">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 days</SelectItem>
                    <SelectItem value="last-90-days">Last 90 days</SelectItem>
                    <SelectItem value="last-year">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Report Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reportCategories.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <category.icon className="h-5 w-5" />
                      <span>{category.title}</span>
                    </CardTitle>
                    <CardDescription>
                      {category.reports.length} available reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.reports.map((report, reportIndex) => (
                        <div key={reportIndex} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{report.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {report.lastGenerated}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <BarChart3 className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Report Activity</CardTitle>
                <CardDescription>Latest generated reports and scheduled reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { report: "Weight Gain Analysis", user: "Ahmad Hassan", time: "2 hours ago", status: "Completed" },
                    { report: "Vaccination Schedule", user: "Fatima Khan", time: "4 hours ago", status: "Completed" },
                    { report: "Investment Analysis", user: "Muhammad Ali", time: "6 hours ago", status: "Completed" },
                    { report: "Monthly Performance Report", user: "System", time: "1 day ago", status: "Scheduled" },
                    { report: "Incident Summary", user: "Sara Ahmed", time: "2 days ago", status: "Completed" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900">{activity.report}</p>
                          <p className="text-sm text-gray-600">Generated by {activity.user}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={activity.status === 'Completed' ? 'default' : 'secondary'}>
                          {activity.status}
                        </Badge>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Reports;
