import { Button } from '..';

export default {
    title: 'Button',
    component: Button,
    argTypes: {
        text: { control: 'text' },
        icon: { control: 'text' },
        action: { control: 'select', options: ['close', '', 'custom'] },
        tier: { control: 'select', options: ['primary', 'secondary', 'tertiary'] },
        isActive: { control: 'boolean' },
        isDisabled: { control: 'boolean' },
    },
};

const Template = ({ ...args }) => <Button {...args} />;

export const PrimaryButton:any = Template.bind({});
PrimaryButton.args = {
    text: 'Click Me',
    tier: 'primary',
};

export const CloseButton:any = Template.bind({});
CloseButton.args = {
    text: 'Close',
    icon: 'xmark',
    action: 'close',
};

export const IconButton:any = Template.bind({});
IconButton.args = {
    icon: 'star',
    tier: 'secondary',
};

export const DisabledButton:any = Template.bind({});
DisabledButton.args = {
    text: 'Disabled',
    isDisabled: true,
};

export const ActiveButton:any = Template.bind({});
ActiveButton.args = {
    text: 'Active',
    isActive: true,
};

export const CustomAction:any = Template.bind({});
CustomAction.args = {
    text: 'Custom Action',
    action: 'custom',
};
