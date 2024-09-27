import Client from "@/middleware/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { AuthProvider } from "@/middleware/context/authContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/forms/protected";
import Dashboard from "@/pages/dashboard";
import DistributePage from "@/pages/distributeRegistrations";
import FatchRegistration from "@/pages/fatchRegister";
import CreateMemberForm from "@/pages/formMember";
import SignLeaderForm from "@/pages/formleader";
import AssignedForm from "@/pages/memberAssign";
import MembersFatch from "@/pages/members";
import SignIn from "@/pages/signin";
import SubChurchFormTable from "@/pages/subChurchTables";
import MainTableForm from "@/pages/tables";
import RootLayout from "./layout/rootLayout";
import CareGroupMembers from "@/pages/callList";
import Commonroute from "@/pages/reRoute";
import CallerList from "@/pages/callerList";
import UpdateLeaderProfile from "@/pages/updateLeaderProfile";
import LeaderMembersFatch from "@/pages/LeaderMembers";
import CurrentWeekRegistrations from "@/components/data/fatchCurrentRegister";
import UpdateSubProfile from "@/pages/updateSubProfile ";
import CurrentWeekRegistrationsforSub from "@/components/data/fatchCurrentRegisterforSub";
import Excel from "@/pages/excel";

function Navigation() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ApolloProvider client={Client}>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="*" element={<h1>Wrong Path</h1>} />
              <Route
                path="/commonroute"
                element={
                  <>
                    <Commonroute />
                  </>
                }
              />
              <Route
                path="/grouplist"
                element={
                  <ProtectedRoute expectedType={["Leader", "SubLeader"]}>
                    <CareGroupMembers />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/callerlist"
                element={
                  <ProtectedRoute expectedType={["Leader"]}>
                    <CallerList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create/members"
                element={
                  <ProtectedRoute
                    expectedType={["Leader", "SubLeader", "subChurch"]}
                  >
                    <CreateMemberForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute expectedType={["Leader", "SubLeader"]}>
                    <UpdateLeaderProfile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/subprofile"
                element={
                  <ProtectedRoute expectedType={["subChurch"]}>
                    <UpdateSubProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                index
                element={
                  <ProtectedRoute expectedType={["Admin", "subChurch"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                index
                path="/dashboard/create/subform"
                element={
                  <ProtectedRoute expectedType={["Admin", "subChurch"]}>
                    <SignLeaderForm />
                  </ProtectedRoute>
                }
              />
               <Route
                index
                path="/dashboard/create/members"
                element={
                  <ProtectedRoute expectedType={["Admin", "subChurch"]}>
                    <Excel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/distributeRegistrations"
                element={
                  <ProtectedRoute expectedType={["Admin"]}>
                    <DistributePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/tables"
                element={
                  <ProtectedRoute expectedType={["Admin", "subChurch"]}>
                    <MainTableForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/tables/sub/:subid"
                element={
                  <ProtectedRoute expectedType={["Admin", "subChurch"]}>
                    <SubChurchFormTable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/create/members/:memberid"
                element={
                  <ProtectedRoute expectedType={["Admin", "subChurch"]}>
                    <CreateMemberForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/tables/members/:memberid"
                element={
                  <ProtectedRoute expectedType={["Admin", "subChurch"]}>
                    <MembersFatch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/tables/members"
                element={
                  <ProtectedRoute expectedType={["Admin", "subChurch"]}>
                    <MembersFatch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/tables/leader/members/:leaderid"
                element={
                  <ProtectedRoute expectedType={["Admin", "subChurch"]}>
                    <LeaderMembersFatch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/tables/members/registers/:memberid"
                element={
                  <ProtectedRoute expectedType={["Admin", "subChurch"]}>
                    <FatchRegistration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/tables/member/register/currentweekly"
                element={
                  <ProtectedRoute expectedType={["Admin"]}>
                    <CurrentWeekRegistrations />
                  </ProtectedRoute>
                }
              />

              <Route
                path="dashboard/tables/sub/member/register/currentweekly"
                element={
                  <ProtectedRoute expectedType={["Admin", "subChurch"]}>
                    <CurrentWeekRegistrationsforSub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/members/assign/:assignid"
                element={
                  <ProtectedRoute expectedType={["Admin"]}>
                    <AssignedForm />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </ApolloProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default Navigation;
