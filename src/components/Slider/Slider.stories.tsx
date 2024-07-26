import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import SliderProps  from './Slider';
import Slider from './Slider';

export default {
  title: 'Components/Slider',
  component: Slider,
  argTypes: {
    type: {
      control: { type: 'select', options: ['Continuous', 'Discreet'] },
    },
    subtype: {
      control: { type: 'select', options: ['Single', 'Range'] },
    },
    numberOfSteps: {
      control: { type: 'number', min: 1, max: 10 },
    },
    handleSize: {
      control: { type: 'select', options: ['Size_24', 'Size_32'] },
    },
    onChange: { action: 'changed' },
  },
} as Meta;

const Template: StoryFn<typeof SliderProps> = (args) => <Slider {...args} />;

export const Default = Template.bind({});
Default.args = {
  type: 'Continuous',
  subtype: 'Single',
  numberOfSteps: 1,
  handleSize: 'Size_24',
};
