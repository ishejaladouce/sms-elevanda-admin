import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { api } from "../services/api.js";
import { deviceId } from "../utils/device.js";
import { useAuthStore } from "../store/authStore.js";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default function LoginPage() {
  const nav = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  async function onSubmit(values) {
    try {
      form.clearErrors("root");
      const res = await api.post("/api/auth/login", { ...values, deviceId: deviceId() });
      setUser(res.data?.data?.user ?? null);
      nav("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      form.setError("root", { type: "server", message });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h1 className="font-display text-2xl">Admin login</h1>
        <p className="text-muted mt-1">Device verification is required</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Email" type="email" error={form.formState.errors.email?.message} {...form.register("email")} />
          <Input
            label="Password"
            type="password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
          {form.formState.errors.root?.message ? (
            <div className="text-danger text-sm">{form.formState.errors.root.message}</div>
          ) : null}

          <div className="text-sm text-muted">
            Device ID: <span className="font-mono">{deviceId()}</span>
          </div>

          <Button type="submit" loading={form.formState.isSubmitting} className="w-full">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}

