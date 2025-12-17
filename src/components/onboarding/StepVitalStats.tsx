import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface VitalStatsData {
  age: number;
  gender: string;
  heightUnit: 'cm' | 'ft';
  heightCm: number;
  heightFt: number;
  heightIn: number;
  weightUnit: 'kg' | 'lbs';
  weightKg: number;
  weightLbs: number;
  ethnicity: string;
  bodyFatPercent: number;
}

interface StepVitalStatsProps {
  data: VitalStatsData;
  onChange: (data: VitalStatsData) => void;
}

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

const ETHNICITY_OPTIONS = [
  'Caucasian',
  'African',
  'Asian',
  'Hispanic/Latino',
  'Middle Eastern',
  'South Asian',
  'Mixed/Multi-Ethnic',
  'Other',
];

export function StepVitalStats({ data, onChange }: StepVitalStatsProps) {
  const update = (partial: Partial<VitalStatsData>) => {
    onChange({ ...data, ...partial });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Age & Gender Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
            Age
          </Label>
          <Input
            type="number"
            variant="cyber-glow"
            value={data.age}
            onChange={(e) => update({ age: parseInt(e.target.value) || 0 })}
            min={13}
            max={100}
            className="h-12"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
            Gender
          </Label>
          <Select value={data.gender} onValueChange={(v) => update({ gender: v })}>
            <SelectTrigger className="h-12 bg-surface border-border focus:border-primary">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Height */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
            Height
          </Label>
          <div className="flex bg-surface-dark rounded-md p-0.5">
            {(['cm', 'ft'] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => update({ heightUnit: unit })}
                className={`px-3 py-1 rounded text-xs font-mono uppercase transition-all ${
                  data.heightUnit === unit
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
        
        {data.heightUnit === 'cm' ? (
          <Input
            type="number"
            variant="cyber-glow"
            value={data.heightCm}
            onChange={(e) => update({ heightCm: parseInt(e.target.value) || 0 })}
            min={100}
            max={250}
            className="h-12"
            placeholder="Height in cm"
          />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              variant="cyber-glow"
              value={data.heightFt}
              onChange={(e) => update({ heightFt: parseInt(e.target.value) || 0 })}
              min={3}
              max={8}
              className="h-12"
              placeholder="Feet"
            />
            <Input
              type="number"
              variant="cyber-glow"
              value={data.heightIn}
              onChange={(e) => update({ heightIn: parseInt(e.target.value) || 0 })}
              min={0}
              max={11}
              className="h-12"
              placeholder="Inches"
            />
          </div>
        )}
      </div>

      {/* Weight */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
            Weight
          </Label>
          <div className="flex bg-surface-dark rounded-md p-0.5">
            {(['kg', 'lbs'] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => update({ weightUnit: unit })}
                className={`px-3 py-1 rounded text-xs font-mono uppercase transition-all ${
                  data.weightUnit === unit
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
        
        <Input
          type="number"
          variant="cyber-glow"
          value={data.weightUnit === 'kg' ? data.weightKg : data.weightLbs}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            update(data.weightUnit === 'kg' ? { weightKg: val } : { weightLbs: val });
          }}
          min={30}
          max={300}
          className="h-12"
          placeholder={`Weight in ${data.weightUnit}`}
        />
      </div>

      {/* Ethnicity */}
      <div className="space-y-2">
        <Label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
          Ethnicity
        </Label>
        <Select value={data.ethnicity} onValueChange={(v) => update({ ethnicity: v })}>
          <SelectTrigger className="h-12 bg-surface border-border focus:border-primary">
            <SelectValue placeholder="Select ethnicity..." />
          </SelectTrigger>
          <SelectContent>
            {ETHNICITY_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Body Fat % */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
            Body Fat %
          </Label>
          <span className="text-lg font-display text-primary">{data.bodyFatPercent}%</span>
        </div>
        <Slider
          value={[data.bodyFatPercent]}
          onValueChange={([v]) => update({ bodyFatPercent: v })}
          min={5}
          max={40}
          step={1}
          className="[&_[role=slider]]:border-primary [&_[role=slider]]:bg-primary"
        />
        <div className="flex justify-between text-xs font-mono text-muted-foreground">
          <span>5%</span>
          <span>40%+</span>
        </div>
      </div>
    </div>
  );
}
