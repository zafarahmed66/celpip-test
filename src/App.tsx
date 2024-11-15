import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/components/layout";
import Test from "./pages/home/test";
import VideoInstruction from "./components/video-instruction";
import ReadingAnswerKey from "./pages/reading/components/reading-answer-key";
import Writing from "./pages/writing/writing";
import Listening from "./pages/listening/listening";
import ListeningAnswerKeyPage from "./pages/listening/components/answer-key";
import Reading from "./pages/reading/reading";
import ListeningResult from "./pages/listening/components/result";
import ReadingResult from "./pages/reading/components/reading-result-page";
import Speaking from "./pages/speaking/speaking";
import Dashboard from "./pages/dashboard";
import AuthForm from "./pages/auth/auth";
import ProtectedRoute from "./pages/protected-route";
import PublicRoute from "./pages/public-route";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <PublicRoute element={<AuthForm />} />,
  },
  {
    path: "/",
    element: <ProtectedRoute element={<Layout />} />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/test",
        element: <Test />,
      },

      {
        path: "/listening/:sectionId",
        element: <Listening />,
      },
      {
        path: "/listening/answer-key",
        element: <ListeningAnswerKeyPage />,
      },
      {
        path: "/listening/result",
        element: <ListeningResult />,
      },
     

      // reading
      {
        path: "/reading/:sectionId",
        element: <Reading />,
      },
      {
        path: "/reading/answer-key",
        element: <ReadingAnswerKey />,
      },
      {
        path: "/reading/result",
        element: <ReadingResult />,
      },

      // Writing
      {
        path: "/writing/:sectionId",
        element: <Writing />,
      },

     

      // Speaking
      {
        path: "/speaking/:sectionId",
        element: <Speaking />,
      },
     

      // complete
      {
        path: "/complete-test",
        element: (
          <VideoInstruction
            title="Overview Instructional Video"
            prevLink="/"
          />
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
