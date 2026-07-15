import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/LocaleContext';

interface LengthSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function LengthSlider({ value, onChange, min = 4, max = 128 }: LengthSliderProps) {
  const percent = ((value - min) / (max - min)) * 100;
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor="length-slider" className="text-sm font-medium text-[var(--color-text-secondary)]">
          {t('lengthLabel')}
        </label>
        <span
          className="font-mono text-3xl font-semibold tabular-nums text-[var(--color-text-primary)]"
          aria-hidden="true"
        >
          {value}
        </span>
      </div>

      <input
        id="length-slider"
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={`Longitud de la contraseña: ${value} caracteres`}
        className={cn(
          'h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-border)]',
          'accent-[var(--color-accent)]',
          '[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
          '[&::-webkit-slider-thumb]:bg-[var(--color-accent)] [&::-webkit-slider-thumb]:shadow-md',
          '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-110',
          '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:border-0',
          '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-accent)]'
        )}
        style={{
          background: `linear-gradient(to right, var(--color-accent) ${percent}%, var(--color-border) ${percent}%)`,
        }}
      />

      <div className="mt-1 flex justify-between text-xs text-[var(--color-text-secondary)]">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
