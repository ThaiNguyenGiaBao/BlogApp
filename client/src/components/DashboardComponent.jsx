import { Table } from "flowbite-react";
import { FaUsers } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";

function DashboardComponent() {
    const [totalMetrics, setTotalMetrics] = useState({
        totalUser: 0,
        totalComment: 0,
        totalPost: 0
    });

    const [lastMonthMetrics, setLastMonthMetrics] = useState({
        totalUser: 0,
        totalComment: 0,
        totalPost: 0
    });

    const [recentUsers, setRecentUsers] = useState([]);
    const [recentComments, setRecentComments] = useState([]);


    useEffect(() => {
        //fetch data
        axios.get("http://localhost:3001/user/getusers")
            .then(res => {
                setTotalMetrics(prev => ({ ...prev, totalUser: res.data.length }));
            })
            .catch(err => console.log(err.message));

    }, []);
  return (
    <div className="max-w-2xl lg:max-w-max table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <div className="w-full sm:w-60 p-4  border rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">TOTAL USER</p>
              <p>100</p>
            </div>
            <FaUsers className="text-5xl text-white bg-cyan-600 rounded-full p-2" />
          </div>
          <p className="mt-5">8 Last month</p>
        </div>
        <div className="w-full sm:w-60 p-4  border rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <p>TOTAL COMMENT</p>
              <p>100</p>
            </div>
            <FaUsers className="text-5xl text-white bg-cyan-600 rounded-full p-2" />
          </div>
          <p className="mt-5">8 Last month</p>
        </div>
        <div className="w-full sm:w-60 p-4  border rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <p>TOTAL USER</p>
              <p>100</p>
            </div>
            <FaUsers className="text-5xl" />
          </div>
          <p className="mt-5">8 Last month</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
        <div className="border rounded-md shadow-sm p-4 w-60">
          <h1 className="font-semibold">Recent Users</h1>
          <div className="flex ">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="ml-4">
              <p className="font-semibold">BaoTN</p>
              <p>thaibao@123</p>
            </div>
          </div>
        </div>
        <div className="border rounded-md shadow-sm p-4 w-96">
          <h1 className="font-semibold">Recent Comments</h1>
          <div className="flex gap-2">
            <div className="flex-1">Nice br</div>
            <div className="">1 likes</div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">Nice br</div>
            <div className="">1 likes</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardComponent;
