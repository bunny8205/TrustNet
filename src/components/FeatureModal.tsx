// src/components/FeatureModal.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface FeatureModalProps {
  open: boolean;
  onClose: () => void;
  feature: {
    title: string;
    description: string;
    unlocked: boolean;
    currentLevel: string;
    action?: () => void;
  };
}

const FeatureModal: React.FC<FeatureModalProps> = ({ open, onClose, feature }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle style={{
        backgroundColor: feature.unlocked ? '#ecfdf5' : '#f3f4f6',
        borderLeft: `4px solid ${feature.unlocked ? '#10b981' : '#9ca3af'}`
      }}>
        {feature.unlocked ? '✅ ' : '🔒 '}{feature.title}
      </DialogTitle>
      <DialogContent style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>Description</h4>
          <p style={{ margin: 0, color: '#4b5563' }}>{feature.description}</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>Current Status</h4>
          <p style={{ margin: 0, color: feature.unlocked ? '#047857' : '#6b7280' }}>
            {feature.unlocked
              ? `You have ${feature.currentLevel} access to this feature`
              : 'This feature is currently locked'}
          </p>
        </div>

        {feature.unlocked && (
          <div style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '16px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>Try it out</h4>
            <p style={{ margin: '0 0 16px 0', color: '#4b5563' }}>
              This is a mock interaction to demonstrate how this feature would work.
            </p>
            <Button
              variant="contained"
              color="primary"
              onClick={feature.action}
              style={{ marginRight: '8px' }}
            >
              Apply
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Learn More
            </Button>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeatureModal;