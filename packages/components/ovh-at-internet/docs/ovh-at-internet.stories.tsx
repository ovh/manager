import React, { useEffect, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import OvhAtInternet from '@ovh-ux/ovh-at-internet';
import { OdsButton } from '@ovhcloud/ods-components/react';

const meta: Meta = {
  title: 'Core/OVH AT Internet/Examples',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

// Basic example component to demonstrate tracking
const TrackingDemo = ({ trackingType, trackingData }) => {
  const [trackingResult, setTrackingResult] = useState('');
  const [atInternet, setAtInternet] = useState<OvhAtInternet | null>(null);

  useEffect(() => {
    // Initialize AT Internet
    const tracker = new OvhAtInternet();
    tracker.setDefaults({
      level2: 'Manager',
      country: 'FR',
    });
    tracker.init(true);
    setAtInternet(tracker);
  }, []);

  const handleTrack = () => {
    if (!atInternet) return;
    
    try {
      // Perform tracking based on the selected type
      switch (trackingType) {
        case 'trackPage':
          atInternet.trackPage(trackingData);
          break;
        case 'trackClick':
          atInternet.trackClick(trackingData);
          break;
        case 'trackImpression':
          atInternet.trackImpression(trackingData);
          break;
        case 'trackClickImpression':
          atInternet.trackClickImpression(trackingData);
          break;
        default:
          break;
      }
      
      setTrackingResult(`Successfully tracked ${trackingType} with data: ${JSON.stringify(trackingData, null, 2)}`);
    } catch (error) {
      setTrackingResult(`Error tracking ${trackingType}: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h4>Tracking Type: {trackingType}</h4>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(trackingData, null, 2)}
        </pre>
      </div>
      <OdsButton 
        onClick={handleTrack}
        label={`Track ${trackingType}`}
      />      
      {trackingResult && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#f0f8ff', borderRadius: '4px' }}>
          <h4>Result:</h4>
          <pre>{trackingResult}</pre>
        </div>
      )}
    </div>
  );
};

// Page Tracking Example
export const PageTrackingExample: StoryObj = {
  render: () => (
    <TrackingDemo 
      trackingType="trackPage" 
      trackingData={{
        name: 'dashboard::overview',
        level2: 'Manager',
        chapter1: 'dashboard',
        chapter2: 'overview',
      }} 
    />
  ),
};

// Click Tracking Example
export const ClickTrackingExample: StoryObj = {
  render: () => (
    <TrackingDemo 
      trackingType="trackClick" 
      trackingData={{
        name: 'button::submit',
        level2: 'Manager',
        chapter1: 'dashboard',
        chapter2: 'actions',
        chapter3: 'submit',
      }} 
    />
  ),
};

// Impression Tracking Example
export const ImpressionTrackingExample: StoryObj = {
  render: () => (
    <TrackingDemo 
      trackingType="trackImpression" 
      trackingData={{
        name: 'banner::promo',
        level2: 'Manager',
        chapter1: 'dashboard',
        chapter2: 'banner',
        chapter3: 'promo',
        onsitead_type: 'banner',
        onsitead_campaign: 'summer_promo',
        onsitead_creation: 'main_banner',
        onsitead_variant: 'A',
        onsitead_format: '728x90',
        onsitead_general_placement: 'top',
        onsitead_detailed_placement: 'header',
        onsitead_advertiser: 'ovh',
        onsitead_url: 'https://www.ovh.com/promo',
      }} 
    />
  ),
};

// Click Impression Tracking Example
export const ClickImpressionTrackingExample: StoryObj = {
  render: () => (
    <TrackingDemo 
      trackingType="trackClickImpression" 
      trackingData={{
        click: {
          name: 'banner::promo::click',
          level2: 'Manager',
          chapter1: 'dashboard',
          chapter2: 'banner',
          chapter3: 'promo',
          onsitead_type: 'banner',
          onsitead_campaign: 'summer_promo',
          onsitead_creation: 'main_banner',
          onsitead_variant: 'A',
          onsitead_format: '728x90',
          onsitead_general_placement: 'top',
          onsitead_detailed_placement: 'header',
          onsitead_advertiser: 'ovh',
          onsitead_url: 'https://www.ovh.com/promo',
        }
      }} 
    />
  ),
};
