
// InvestorCard.tsx

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TrendingUp, TrendingDown, Mail, Phone } from "lucide-react";

interface InvestorCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalInvestment: number;
  animalsOwned: number;
  currentValue: number;
  roi: number;
  joinDate: string;
  status: string;
}

export function InvestorCard({
  id,
  name,
  email,
  phone,
  totalInvestment,
  animalsOwned,
  currentValue,
  roi,
  joinDate,
  status
}: InvestorCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isProfitable = roi >= 0;

  return (
    <Card className="hover:shadow-md transition-shadow rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-lg">{name}</h3>
            <Badge className={getStatusColor(status)}>{status}</Badge>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{id}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Investment</p>
            <p className="text-lg font-bold">${totalInvestment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current Value</p>
            <p className="text-lg font-bold">${currentValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Animals Owned</p>
            <p className="text-xl font-bold">{animalsOwned}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">ROI</p>
            <div className="flex items-center space-x-1">
              <p className={`text-xl font-bold ${isProfitable ? "text-green-600" : "text-red-600"}`}>
                {roi.toFixed(1)}%
              </p>
              {isProfitable ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="h-4 w-4 mr-2" />
            <span className="truncate">{email}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="h-4 w-4 mr-2" />
            <span>{phone}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Joined: {new Date(joinDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Portfolio
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Assign Animals
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}




// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal, TrendingUp, TrendingDown, Mail, Phone } from "lucide-react";
// import { useEffect } from "react";
// import { GetAllInvester } from "@/Apis/Api";
// import { InvestorCardList } from "./InvestorCardList";

// interface InvestorCardProps {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   totalInvestment: number;
//   animalsOwned: number;
//   currentValue: number;
//   roi: number;
//   joinDate: string;
//   status: string;
// }

// export function InvestorCard({ 
//   id, 
//   name, 
//   email, 
//   phone, 
//   totalInvestment, 
//   animalsOwned, 
//   currentValue, 
//   roi, 
//   joinDate, 
//   status 
// }: InvestorCardProps) {
//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'inactive': return 'bg-gray-100 text-gray-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const isProfitable = roi >= 0;

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const fetch = await GetAllInvester();
//       console.log(fetch);
//     } catch (error) {
//       console.log("Error fetching investors:", error);
//     }
//   };

//   fetchData();
// }, []);

//   return (
//     <Card className="hover:shadow-md transition-shadow">
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <h3 className="font-semibold text-lg">{name}</h3>
//             <Badge className={getStatusColor(status)}>
//               {status}
//             </Badge>
//           </div>
//           <Button variant="ghost" size="sm">
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </div>
//         <p className="text-sm text-gray-600">{id}</p>
//       </CardHeader>
      
//       <CardContent className="space-y-4">
//      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//       {investors.map((inv) => (
//         <InvestorCard
//           key={inv.id}
//           id={String(inv.id)}
//           name={inv.name}
//           email={inv.email}
//           phone={inv.phone}
//           totalInvestment={parseFloat(inv.total_investment)}
//           currentValue={parseFloat(inv.total_investment)}
//           animalsOwned={0}
//           roi={0}
//           joinDate={inv.created_at}
//           status="active"
//         />
//       ))}
//     </div>
//       </CardContent>
//     </Card>
//   );
// }
