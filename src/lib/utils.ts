export function getColorScheme(highContrast: boolean, isDarkMode: boolean) {
    if (isDarkMode) {
      return highContrast
        ? {
            userPit: "bg-blue-600",
            userPitHover: "hover:bg-blue-700",
            userStore: "bg-blue-700",
            aiPit: "bg-red-600",
            aiStore: "bg-red-700",
            inactivePit: "bg-gray-700",
            text: "text-white",
            heading: "text-white font-extrabold",
            background: "bg-gray-900",
            card: "bg-gray-800"
          }
        : {
            userPit: "bg-blue-500",
            userPitHover: "hover:bg-blue-600",
            userStore: "bg-blue-600",
            aiPit: "bg-yellow-500",
            aiStore: "bg-yellow-600",
            inactivePit: "bg-gray-600",
            text: "text-white",
            heading: "text-gray-200",
            background: "bg-gray-900",
            card: "bg-gray-800"
          };
    } else {
      return highContrast
        ? {
            userPit: "bg-blue-700",
            userPitHover: "hover:bg-blue-800",
            userStore: "bg-blue-800",
            aiPit: "bg-red-700",
            aiStore: "bg-red-800",
            inactivePit: "bg-gray-700",
            text: "text-white",
            heading: "text-black font-extrabold",
            background: "bg-gray-100",
            card: "bg-white"
          }
        : {
            userPit: "bg-blue-500",
            userPitHover: "hover:bg-blue-600",
            userStore: "bg-blue-600",
            aiPit: "bg-yellow-500",
            aiStore: "bg-yellow-600",
            inactivePit: "bg-gray-300",
            text: "text-white",
            heading: "text-gray-800",
            background: "bg-gray-100",
            card: "bg-white"
          };
    }
  }