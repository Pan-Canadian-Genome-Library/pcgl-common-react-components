import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeaderContainer } from "@repo/ui/header";

const meta = {
  title: "PCGL/Header",
  component: HeaderContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof HeaderContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  args: {
    brandColor: "#054A74",
    skipLinks: [{ href:'#main', label: 'label.main' }, { href: '#footer', label: 'label.about'}],
    ImageLogo: () => (
      <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#054A74", fontWeight: 700, fontSize: "18px" }}>
        <span style={{ background: "#054A74", color: "#fff", padding: "4px 8px", borderRadius: "4px", marginRight: "8px" }}>PCGL</span>
        Research Portal
      </a>
    ),
    MenuOptions: () => (
      <nav aria-label="Main Navigation">
        <ul style={{ display: "flex", gap: "12px", listStyle: "none", margin: 0, padding: 0 }}>
          <li><a href="#cohorts" style={{ color: "#26374a", textDecoration: "none", fontWeight: 500 }}>Cohorts</a></li>
          <li><a href="#datasets" style={{ color: "#26374a", textDecoration: "none", fontWeight: 500 }}>Datasets</a></li>
          <li><a href="#about" style={{ color: "#26374a", textDecoration: "none", fontWeight: 500 }}>About</a></li>
        </ul>
      </nav>
    ),
    SearchBar: () => (
      <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
        <input
          type="search"
          placeholder="Search genes, variants, or datasets..."
          aria-label="Search portal"
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #d0d7de",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        />
      </div>
    ),
    auth: {
      loginUrl: "https://cilogon.org/",
      loginText: "CILogon Service",
      loginLogoUrl: "https://cilogon.org/images/cilogon-logo-32x32.png",
    },
  },
};

export const LoggedIn: Story = {
  args: {
    ...LoggedOut.args,
    auth: {
      user: {
        name: "Dr. Jane Smith",
        email: "jane.smith@alliancecan.ca",
      },
      settingsUrl: "#settings",
      logoutUrl: "#logout",
      onSettingsClick: (e) => {
        e.preventDefault();
        alert("Navigating to My Settings");
      },
      onLogout: (e) => {
        e.preventDefault();
        alert("User logged out");
      },
    },
  },
};

export const MinimalLoggedIn: Story = {
  args: {
    brandColor: "#054A74",
    auth: {
      user: {
        name: "Dr. Jane Smith",
        email: "jane.smith@alliancecan.ca",
      },
    }
  },
};

export const Minimal: Story = {
  args: {
    brandColor: "#054A74",
    auth: {
      loginUrl: "https://cilogon.org/",
    },
  },
};

export const PCGLExample: Story = {
  args: {
    auth: {
      user: {
        name: "Dr. Jean Dupont",
      },
    },
    children: 
    <div style={{display: 'flex', width: '100%', justifyContent:'space-between'}}>
      <div>
        <img
          alt="logo"
          aria-hidden="true"
          style={{
            height: '40px',
            verticalAlign: 'middle',
            transform: 'translateY(-3px)',
            paddingLeft: '4px'
          }}
          src="https://pcgl.bento.sd4h.ca/public/assets/branding.lightbg.png"
        />
        <h1
          className="visually-hidden"
          style={{ whiteSpace: 'nowrap' }}
        >
          Pan-Canadian Genome Library
        </h1>
      </div>

      <button
        type="button"
        style={{display: 'flex', alignItems: 'center'}}
      >
        <span className="ant-btn-icon">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{ transform: 'translateY(1px)' }}
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 15V17C5 18.0544 5.81588 18.9182 6.85074 18.9945L7 19H10V21H7C4.79086 21 3 19.2091 3 17V15H5ZM18 10L22.4 21H20.245L19.044 18H14.954L13.755 21H11.601L16 10H18ZM17 12.8852L15.753 16H18.245L17 12.8852ZM8 2V4H12V11H8V14H6V11H2V4H6V2H8ZM17 3C19.2091 3 21 4.79086 21 7V9H19V7C19 5.89543 18.1046 5 17 5H14V3H17ZM6 6H4V9H6V6ZM10 6H8V9H10V6Z" />
          </svg>
        </span>
        <span>Français</span>
      </button>
    </div>
  },
};
