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
    brand: "#054A74",
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

export const Minimal: Story = {
  args: {
    brand: "#054A74",
    auth: {
      loginUrl: "https://cilogon.org/",
    },
  },
};

export const BilingualFrench: Story = {
  args: {
    ...LoggedIn.args,
    translator: (key: string) => {
      const dict: Record<string, string> = {
        "header.skipLinks.mainContent": "Passer au contenu principal",
        "header.skipLinks.about": "Passer à « À propos de la BPCG »",
        "header.auth.login": "Service CILogon",
        "header.auth.mySettings": "Mes paramètres",
        "header.auth.logOut": "Se déconnecter",
      };
      return dict[key] ?? key;
    },
    auth: {
      user: {
        name: "Dr. Jean Dupont",
      },
    },
  },
};
