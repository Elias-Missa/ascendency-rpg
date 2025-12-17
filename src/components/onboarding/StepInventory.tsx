import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Pill, Shield } from 'lucide-react';

export interface InventoryData {
  supplements: string[];
  consentedToBiometrics: boolean;
}

interface StepInventoryProps {
  data: InventoryData;
  onChange: (data: InventoryData) => void;
}

export function StepInventory({ data, onChange }: StepInventoryProps) {
  const [inputValue, setInputValue] = useState('');

  const update = (partial: Partial<InventoryData>) => {
    onChange({ ...data, ...partial });
  };

  const addSupplement = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !data.supplements.includes(trimmed)) {
      update({ supplements: [...data.supplements, trimmed] });
      setInputValue('');
    }
  };

  const removeSupplement = (item: string) => {
    update({ supplements: data.supplements.filter((s) => s !== item) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSupplement();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Supplements & Meds */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-center">
            <Pill className="w-5 h-5 text-primary" />
          </div>
          <div>
            <Label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Supplements & Medications
            </Label>
            <p className="text-xs text-muted-foreground">Current items you're taking</p>
          </div>
        </div>

        {/* Tag Input */}
        <div className="flex gap-2">
          <Input
            variant="cyber-glow"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Creatine, Minoxidil..."
            className="h-12 flex-1"
          />
          <button
            onClick={addSupplement}
            disabled={!inputValue.trim()}
            className="h-12 px-4 rounded-md border border-primary bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Tags Display */}
        <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-lg border border-border bg-surface/30">
          {data.supplements.length === 0 ? (
            <p className="text-sm text-muted-foreground font-mono">No items added yet</p>
          ) : (
            data.supplements.map((item) => (
              <Badge
                key={item}
                variant="outline"
                className="pl-3 pr-1 py-1.5 border-primary/50 bg-primary/10 text-primary font-mono text-xs"
              >
                {item}
                <button
                  onClick={() => removeSupplement(item)}
                  className="ml-2 hover:bg-primary/20 rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Legal Consent */}
      <div className="p-6 rounded-lg border-2 border-primary/30 bg-primary/5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-primary bg-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">Legal Consent Required</p>
            <p className="text-xs text-muted-foreground font-mono">BIPA & Privacy Compliance</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            By checking the box below, you consent to the collection and AI-powered analysis of your facial biometric data for the purpose of providing personalized recommendations.
          </p>
          <p className="text-xs">
            Your data is encrypted and stored securely. You may request deletion at any time.
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <Checkbox
            checked={data.consentedToBiometrics}
            onCheckedChange={(checked) => update({ consentedToBiometrics: checked === true })}
            className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-sm text-foreground leading-relaxed group-hover:text-primary transition-colors">
            I consent to AI-powered biometric analysis and understand how my data will be used.
          </span>
        </label>
      </div>
    </div>
  );
}
