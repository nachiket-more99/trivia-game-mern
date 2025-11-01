import * as React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

type ContainerProps = {
  children: React.ReactNode;
};

const Navbar = (props: ContainerProps) => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menu = document.getElementById("nav-user-menu");
      if (menu && !menu.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="app-container">
      <nav className="app-nav">
        <div className="nav-logo" onClick={() => navigate("/")}>
          <div className="nav-logo-icon">Q</div>
          TriviaGame
        </div>

        <div className="nav-right">
          {!isLoading && user === undefined && !isAuthenticated && (
            <>
              <Button
                className="nav-btn-ghost"
                onClick={() => navigate("/leaderboard")}
              >
                Leaderboard
              </Button>
              <Button
                className="nav-btn-ghost"
                onClick={() => loginWithRedirect()}
              >
                Log in
              </Button>
              <Button
                className="nav-btn-primary"
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: { screen_hint: "signup" },
                  })
                }
              >
                Sign up
              </Button>
            </>
          )}

          {!isLoading && user !== undefined && isAuthenticated && (
            <>
              <Button
                className="nav-btn-ghost"
                onClick={() => navigate("/leaderboard")}
              >
                Leaderboard
              </Button>
              <div className="nav-user-menu" id="nav-user-menu">
<div className="nav-avatar-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
  <div className="nav-avatar-initials">
    {user.nickname?.slice(0, 2).toUpperCase() || user.name?.slice(0, 2).toUpperCase() || "U"}
  </div>
</div>

                {dropdownOpen && (
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-item">{user.name}</div>
                    <div
                      className="nav-dropdown-item"
                      onClick={() => {
                        navigate("/leaderboard");
                        setDropdownOpen(false);
                      }}
                    >
                      Leaderboard
                    </div>
                    <div
                      className="nav-dropdown-logout"
                      onClick={() =>
                        logout({
                          logoutParams: { returnTo: window.location.origin },
                        })
                      }
                    >
                      Log out
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>

      {props.children}
    </div>
  );
};

export default Navbar;
