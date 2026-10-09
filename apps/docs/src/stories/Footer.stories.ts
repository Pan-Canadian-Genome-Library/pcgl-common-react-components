import type { Meta, StoryObj } from "@storybook/react-vite";
import { FooterContainer } from "@repo/ui/footer";

const meta = {
  title: "PCGL/Footer",
  component: FooterContainer,
  tags: ["autodocs"],
} satisfies Meta<typeof FooterContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    brand: "#929497",
    translator: (s) => s,
  },
};