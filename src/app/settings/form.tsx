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
import { Input } from "@/components/ui/input";
import { api } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type UserSettingSchema = Static<typeof elysiaSchemas.users.settings>;

function SettingsField({
  formControl,
  name,
}: {
  formControl: Control<UserSettingSchema>;
  name: keyof UserSettingSchema;
}) {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {name.charAt(0).toUpperCase() + name.substring(1)}
          </FormLabel>
          <FormControl>
            <Input placeholder={`Your ${name}`} {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export function SettingsForm({
  previousValues: { state, city },
}: {
  previousValues: UserSettingSchema;
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-4 rounded-b-lg"
      >
        <SettingsField formControl={form.control} name="state" />
        <SettingsField formControl={form.control} name="city" />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
