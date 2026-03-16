/**
 * FormField — Reusable form fields for Gas Inspection
 * Design: Large tap targets (44px+), bilingual labels, DefectSelector
 * Mobile-optimized for iOS/Android field use
 */
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface BaseFieldProps {
  labelPt: string;
  labelEn: string;
  required?: boolean;
  className?: string;
}

interface TextFieldProps extends BaseFieldProps {
  type: 'text' | 'number' | 'date' | 'textarea';
  value: string | number | null;
  onChange: (value: string) => void;
  placeholder?: string;
  unit?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel';
  min?: number;
  max?: number;
  step?: string;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

interface SwitchFieldProps extends BaseFieldProps {
  type: 'switch';
  value: boolean;
  onChange: (value: boolean) => void;
}

interface DefectFieldProps extends BaseFieldProps {
  type: 'defect';
  value: string;
  onChange: (value: string) => void;
}

type FormFieldProps = TextFieldProps | SelectFieldProps | SwitchFieldProps | DefectFieldProps;

export default function FormField(props: FormFieldProps) {
  const { labelPt, labelEn, required, className = '' } = props;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="block">
        <span className="font-medium text-sm text-foreground">{labelPt}</span>
        <span className="text-xs text-muted-foreground ml-1.5">/ {labelEn}</span>
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>

      {props.type === 'text' || props.type === 'number' || props.type === 'date' ? (
        <div className="relative">
          <Input
            type={props.type === 'number' ? 'text' : props.type}
            inputMode={props.type === 'number' ? (props.inputMode || 'decimal') : props.inputMode}
            value={props.value ?? ''}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            min={props.min}
            max={props.max}
            step={props.step}
            className="min-h-[44px] text-base"
          />
          {props.unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
              {props.unit}
            </span>
          )}
        </div>
      ) : props.type === 'textarea' ? (
        <Textarea
          value={props.value ?? ''}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className="min-h-[88px] text-base"
        />
      ) : props.type === 'select' ? (
        <Select value={props.value} onValueChange={props.onChange}>
          <SelectTrigger className="min-h-[44px] text-base">
            <SelectValue placeholder={props.placeholder || 'Selecionar / Select'} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="min-h-[44px] text-base">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : props.type === 'switch' ? (
        <div className="flex items-center gap-3 min-h-[44px]">
          <Switch
            checked={props.value}
            onCheckedChange={props.onChange}
            className="data-[state=checked]:bg-navy"
          />
          <span className="text-sm text-muted-foreground">
            {props.value ? 'Sim / Yes' : 'Não / No'}
          </span>
        </div>
      ) : props.type === 'defect' ? (
        <DefectSelector value={props.value} onChange={props.onChange} />
      ) : null}
    </div>
  );
}

// Defect classification selector — the core interaction for gas inspection
function DefectSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { value: 'ok', label: 'Conforme', short: 'OK', active: 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-emerald-400', idle: 'hover:bg-emerald-50' },
    { value: 'A', label: 'Tipo A', short: 'A', active: 'bg-blue-100 border-blue-400 text-blue-800 ring-blue-400', idle: 'hover:bg-blue-50' },
    { value: 'B', label: 'Tipo B', short: 'B', active: 'bg-amber-100 border-amber-400 text-amber-800 ring-amber-400', idle: 'hover:bg-amber-50' },
    { value: 'G', label: 'Tipo G', short: 'G', active: 'bg-red-100 border-red-400 text-red-800 ring-red-400', idle: 'hover:bg-red-50' },
  ];

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`h-11 rounded-md border-2 text-sm font-semibold transition-all ${
              isActive
                ? `${opt.active} ring-2 ring-offset-1 shadow-sm`
                : `bg-muted/40 border-border text-muted-foreground ${opt.idle}`
            }`}
          >
            <span className="hidden sm:inline">{opt.label}</span>
            <span className="sm:hidden">{opt.short}</span>
          </button>
        );
      })}
    </div>
  );
}
