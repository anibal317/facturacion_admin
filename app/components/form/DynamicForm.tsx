import { TextField } from "@mui/material";

interface DynamicFormProps {
  data: any;
  onSave: (data: any) => void;
  onChange?: (key: string, value: any) => void;
  disabledFields?: string[];
  hide?: string[];
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  data,
  onSave,
  onChange,
  disabledFields = [],
  hide = [],
}) => {
  return (
    <form>
      {Object.keys(data).map((key) => 
         hide.includes(key) ? null : ( // Si el campo está en `hide`, no se renderiza
        <TextField
          key={key}
          label={key}
          value={data[key]}
          onChange={(e) =>
            onChange
              ? onChange(key, e.target.value)
              : onSave({ ...data, [key]: e.target.value })
          }
          disabled={disabledFields.includes(key)}
          fullWidth
          margin="normal"
        />
      ))}
    </form>
  );
};
export default DynamicForm;