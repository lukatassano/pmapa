import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { formSchema, FormType } from "../../../types/form";
import { useAtom, useSetAtom } from "jotai";
import {
  activeStepAtom,
  handleBackAtom,
  handleNextAtom,
  handleResetAtom,
} from "../../../atoms/stepper";

export function PersonalForm() {
  const [activeStep] = useAtom(activeStepAtom);
  const handleNext = useSetAtom(handleNextAtom);
  const handleBack = useSetAtom(handleBackAtom);
  const handleReset = useSetAtom(handleResetAtom);

  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const navigate = useNavigate();

  const [, setCoordinates] = useState<[number, number] | null>(null);

  const handleFormSubmit = async (data: FormType) => {
    try {
      const address = data.address.zipCode;
      try {
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: address,
              format: "json",
              addressdetails: 1,
            },
          }
        );
        if (response.data.length < 1) {
          setCoordinates(null);
          console.warn(
            "Nenhuma coordenada encontrada para o endereço fornecido"
          );
        }

        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          const coords: [number, number] = [parseFloat(lat), parseFloat(lon)];
          setCoordinates(coords);
          if (coords[0] === 0 && coords[1] === 0) {
            console.warn("Coordenadas inválidas recebidas: [0, 0]");
          } else {
            setCoordinates(coords);
            const newCompany = {
              ...data,
              coordinates: coords,
            };
            const storedCompanies = JSON.parse(
              localStorage.getItem("empresas") || "[]"
            );
            storedCompanies.push(newCompany);
            localStorage.setItem("empresas", JSON.stringify(storedCompanies));
          }
        } else {
          setCoordinates(null);
          console.warn(
            "Nenhuma coordenada encontrada para o endereço fornecido"
          );
        }
      } catch (error) {
        console.error("Erro ao processar o formulário:", error);
      }
    } catch (error) {
      console.error("Erro ao processar o formulário:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Box maxWidth={600} overflow="hidden" paddingTop={2} minWidth={300}>
        <Box
          width="100%"
          overflow="auto"
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Nome"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState?.error?.message}
                size="small"
              />
            )}
          />
          <Controller
            name="cpf"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="CPF"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                inputProps={{ maxLength: 18 }}
                size="small"
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Telefone"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                size="small"
              />
            )}
          />
          <Controller
            name="birthday"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                // type="date"
                label="Data de nascimento"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                size="small"
              />
            )}
          />
          <Controller
            name="gender"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                // type="date"
                label="Genero"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                size="small"
              />
            )}
          />
          <Controller
            name="coren"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Numero do COREN"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                size="small"
              />
            )}
          />

          <Controller
            name="facebook"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Facebook"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                size="small"
              />
            )}
          />
          <Controller
            name="instagram"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Instagram"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                size="small"
              />
            )}
          />

          <Box display="flex" flex={1} gap={1}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/")}
              fullWidth
            >
              Fechar
            </Button>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Enviar
            </Button>

            <Button onClick={handleNext}>Próximo</Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
}
