import { NavLink } from "react-router-dom";
import styles from "./Navigation.module.scss";
import cx from "classnames";
import {
  LogIn as LoginIcon,
  Menu as MenuIcon,
  User as UserIcon,
} from "iconoir-react";
import useUser from "@/hooks/user";
import NavLi, { NavLiProps } from "./NavLi";
import Dropdown from "@/components/custom-ui/Dropdown/Dropdown";
import Avatar from "@/components/custom-ui/Avatar/Avatar";
import { Button } from "@/components/ui/button";

const NavToggle: React.FC<{
  active: boolean;
  children?: React.ReactNode;
  variant?: "outline" | "fill";
}> = ({ active, variant = "outline", children }) => (
  <Button
    type="button"
    variant={variant}
    size="icon"
    aria-label="Menu"
    className={`relative before:content-[''] before:absolute before:-z-10 before:rounded-full before:transition-all duration-200 before:bg-foreground/10 ${
      active ? "before:-inset-1.5" : "before:-inset-0"
    }`}
  >
    {children}
  </Button>
);

const Navbar: React.FC = () => {
  const { loading, user, logout } = useUser();

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];

  interface userLinksType extends NavLiProps {
    noAuth?: boolean;
    rolesVislbleTo?: ("user" | "admin" | "alumni")[];
  }
  const userLinks: userLinksType[] = [
    { label: "Sign in", href: "/login" },
    { label: "Sign up", href: "/register" },
    { label: "Profile", href: "/profile", rolesVislbleTo: ["user", "alumni"] },
    {
      label: "Alumni Membership",
      href: "/alumni-membership",
      rolesVislbleTo: ["user", "alumni"],
    },
    { label: "Admin", href: "/admin", rolesVislbleTo: ["admin"] },
    {
      label: "Logout",
      href: "/",
      action: logout,
      type: "button",
      rolesVislbleTo: ["user", "admin"],
    },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={cx(styles["nav-container"], "container")}>
        <div className={styles.logo}>
          <NavLink to="/">
            <img src="/navbar-banner.svg" alt="NIT AP Alumni" height={40} />
          </NavLink>
        </div>
        <div className={styles["nav-content"]}>
          <ul className={styles["nav-list"]}>
            {links.map((link, index) => (
              <NavLi key={index} {...link} />
            ))}
          </ul>
          <div className={styles["nav-toggles"]}>
            <Dropdown
              position="right"
              toggle={({ isOpen }) => (
                // <Button
                //   type="button"
                //   variant="outline"
                //   size="icon"
                //   aria-label="Menu"
                //   className={`relative before:content-[''] before:absolute before:-z-10 before:rounded-full before:transition-all duration-200 before:bg-accent-foreground ${
                //     isOpen ? "before:-inset-1.5" : "before:-inset-0"
                //   }`}
                // >
                //   <MenuIcon width={22} height={22} strokeWidth={2} />
                // </Button>
                <NavToggle active={isOpen}>
                  <MenuIcon width={22} height={22} strokeWidth={2} />
                </NavToggle>
              )}
              render={({ setIsOpen }) => (
                <div className={cx(styles["collapsable-nav"], "container")}>
                  <hr />
                  <ul className={styles["collapsable-nav-list"]}>
                    {links.map((link, index) => (
                      <NavLi
                        key={index}
                        {...link}
                        action={() => setIsOpen(false)}
                      />
                    ))}
                  </ul>
                </div>
              )}
            />
            {loading ? (
              <div
                className={styles["spinner"]}
                aria-label="Loading auth status"
              ></div>
            ) : (
              <Dropdown
                position="right"
                toggle={({ isOpen }) =>
                  !user ? (
                    <NavToggle active={isOpen} variant="fill">
                      <LoginIcon />
                    </NavToggle>
                  ) : (
                    <NavToggle active={isOpen} variant="fill">
                      {user.avatar ? (
                        <Avatar size="100%" avatar={user?.avatar} />
                      ) : (
                        <UserIcon />
                      )}
                    </NavToggle>
                  )
                }
                render={({ setIsOpen }) => (
                  <div className={cx(styles["collapsable-nav"], "container")}>
                    {user && (
                      <div className={styles["user-info"]}>
                        {user.avatar && (
                          <Avatar avatar={user.avatar} size="6rem" />
                        )}
                        <div className={styles["user-name-wrapper"]}>
                          {user.first_name ? (
                            <div className={styles["user-name"]}>
                              {`${user.title} ${user.first_name} ${user.last_name}`}
                            </div>
                          ) : (
                            <div className={styles["message"]}>
                              Please complete your profile
                            </div>
                          )}
                        </div>
                        <div className={styles["user-email"]}>{user.email}</div>
                      </div>
                    )}
                    <hr />
                    <ul className={styles["collapsable-nav-list"]}>
                      {userLinks
                        .filter(({ rolesVislbleTo }) => {
                          if (!user) return !rolesVislbleTo;
                          return rolesVislbleTo?.some((role) =>
                            user.role.includes(role)
                          );
                        })
                        .map((link) => (
                          <NavLi
                            key={link.href}
                            {...link}
                            action={() => {
                              setIsOpen(false);
                              link.action && link.action();
                            }}
                          />
                        ))}
                    </ul>
                  </div>
                )}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
