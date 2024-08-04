import { useSelector } from "react-redux";
function ThemeProvider({ children }) {
  const theme = useSelector((state) => state.theme);

  return (
    <div className={theme.theme}>
      <div className="bg-white text-gray-800 dark:text-gray-200 dark:bg-[rgb(25,30,42)] ">
        {children}
      </div>
    </div>
  );
}

export default ThemeProvider;
