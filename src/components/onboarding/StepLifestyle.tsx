import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dumbbell, Droplets, Glasses, Moon } from 'lucide-react';

export interface LifestyleData {
  workoutsPerWeek: number;
  waterIntake: string;
  wearsGlasses: boolean;
  usesMouthTape: boolean;
}

interface StepLifestyleProps {
  data: LifestyleData;
  onChange: (data: LifestyleData) => void;
}

const WATER_OPTIONS = ['<1L', '1-2L', '2-3L', '3-4L', '4L+'];

export function StepLifestyle({ data, onChange }: StepLifestyleProps) {
  const update = (partial: Partial<LifestyleData>) => {
    onChange({ ...data, ...partial });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Workouts per Week */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <Label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Workouts per Week
            </Label>
          </div>
          <span className="text-2xl font-display text-primary">{data.workoutsPerWeek}</span>
        </div>
        <Slider
          value={[data.workoutsPerWeek]}
          onValueChange={([v]) => update({ workoutsPerWeek: v })}
          min={0}
          max={7}
          step={1}
          className="[&_[role=slider]]:border-primary [&_[role=slider]]:bg-primary"
        />
        <div className="flex justify-between text-xs font-mono text-muted-foreground">
          <span>0 days</span>
          <span>7 days</span>
        </div>
      </div>

      {/* Water Intake */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-primary" />
          </div>
          <Label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
            Daily Water Intake
          </Label>
        </div>
        <Select value={data.waterIntake} onValueChange={(v) => update({ waterIntake: v })}>
          <SelectTrigger className="h-12 bg-surface border-border focus:border-primary">
            <SelectValue placeholder="Select amount..." />
          </SelectTrigger>
          <SelectContent>
            {WATER_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vision Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-center">
            <Glasses className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Vision Correction</p>
            <p className="text-xs text-muted-foreground font-mono">Do you wear glasses or contacts?</p>
          </div>
        </div>
        <Switch
          checked={data.wearsGlasses}
          onCheckedChange={(v) => update({ wearsGlasses: v })}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      {/* Mouth Tape Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-center">
            <Moon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Night Mouth Taping</p>
            <p className="text-xs text-muted-foreground font-mono">Do you use mouth tape while sleeping?</p>
          </div>
        </div>
        <Switch
          checked={data.usesMouthTape}
          onCheckedChange={(v) => update({ usesMouthTape: v })}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </div>
  );
}
