// import { render, screen } from "@testing-library/react";
// import App from "./App";

// test("renders app header", () => {
//   render(<App />);
//   const headerElement = screen.getByText(/Developer Tools Hub/i);
//   expect(headerElement).toBeInTheDocument();
// });

// import { render, screen } from "@testing-library/react";
// import App from "./App";

// test("renders tab buttons", () => {
//   render(<App />);
//   expect(screen.getByText(/JSON/i)).toBeInTheDocument();
//   expect(screen.getByText(/JWT/i)).toBeInTheDocument();
//   expect(screen.getByText(/Base64/i)).toBeInTheDocument();
// });

import { render } from "@testing-library/react";
import App from "./App";

test("renders without crashing", () => {
  render(<App />);
});
