"use client";

import { useToast } from "@/hooks/use-toast";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { Static } from "elysia";
import { Control, useForm } from "react-hook-form";
import { elysiaSchemas } from "../api/[[...slugs]]/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { api } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { State, City } from "country-state-city";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SelectProps, SelectValueProps } from "@radix-ui/react-select";
import { useEffect } from "react";
import { LoggedUser } from "../api/[[...slugs]]/auth";
import { log } from "console";

type UserSettingSchema = Static<typeof elysiaSchemas.users.settings>;

function SettingsField<T extends { name: string; code: string }>({
  formControl,
  name,
  geoObjects,
  currentValue,
  selectValueProps,
  ...selectProps
}: {
  formControl: Control<UserSettingSchema>;
  name: keyof UserSettingSchema;
  currentValue: string;
  geoObjects: T[];
  selectValueProps?: SelectValueProps;
} & SelectProps) {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem {...field}>
          <FormLabel>
            {name.charAt(0).toUpperCase() + name.substring(1)}
          </FormLabel>
          <FormControl>
            <Select {...selectProps}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    currentValue == "" ? `Your ${name}` : currentValue
                  }
                />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {Object.values(geoObjects).map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export function SettingsForm({
  previousValues: { state, city },
  loggedUser,
}: {
  previousValues: UserSettingSchema;
  loggedUser: LoggedUser;
}) {
  const { toast } = useToast();

  const form = useForm<UserSettingSchema>({
    resolver: typeboxResolver(elysiaSchemas.users.settings),
    defaultValues: {
      state,
      city,
    },
  });

  function onSubmit(values: UserSettingSchema) {
    api.user.settings.post(values).then(() => {
      toast({
        title: "Updated your settings",
      });
    });
  }

  useEffect(() => {
    form.setValue("city", "");
  }, [form.watch("state")]);

  const currentFormValues = form.getValues();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-4 rounded-b-lg"
      >
        <SettingsField
          formControl={form.control}
          currentValue={
            State.getStateByCodeAndCountry(state, loggedUser.country)?.name ||
            ""
          }
          name="state"
          geoObjects={State.getStatesOfCountry(loggedUser.country).map(
            ({ name, ...s }) => ({
              name,
              code: s.isoCode,
            }),
          )}
        />
        <SettingsField
          formControl={form.control}
          currentValue={currentFormValues.city}
          name="city"
          geoObjects={City.getCitiesOfState(
            loggedUser.country,
            currentFormValues.state,
          ).map(({ name }) => ({ name, code: name }))}
          disabled={currentFormValues.state == ""}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
