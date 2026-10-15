import { Form, Head } from '@inertiajs/react';
import { User } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4">
            <Head title="Masuk - Pinjam Yuk!" />

            {/* Login Card - Sesuai Figma Screen 2 */}
            <div className="w-full max-w-[380px] bg-white rounded-xl p-6 sm:p-7 border border-zinc-200 shadow-sm">
                {/* Avatar Icon */}
                <div className="flex flex-col items-center mb-5">
                    <div className="w-16 h-16 rounded-full border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-400 mb-3">
                        <User className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                        Selamat Datang!
                    </h1>
                    <p className="text-xs text-zinc-500 mt-0.5">
                        Masuk untuk melanjutkan
                    </p>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-4"
                >
                    {({ processing, errors }) => (
                        <div className="space-y-3.5">
                            {/* Username */}
                            <div className="space-y-1">
                                <Label htmlFor="email" className="text-xs font-semibold text-zinc-700">
                                    Username
                                </Label>
                                <Input
                                    id="email"
                                    type="text"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="username"
                                    placeholder="Masukkan username anda"
                                    className="rounded-lg py-2 px-3 text-xs bg-white border-zinc-200 focus:ring-1 focus:ring-blue-500"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <Label htmlFor="password" className="text-xs font-semibold text-zinc-700">
                                    Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Masukkan password anda"
                                    className="rounded-lg py-2 px-3 text-xs bg-white border-zinc-200 focus:ring-1 focus:ring-blue-500"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between text-xs pt-0.5">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="rounded border-zinc-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                    />
                                    <Label htmlFor="remember" className="text-xs font-normal text-zinc-600 cursor-pointer">
                                        Ingat Saya
                                    </Label>
                                </div>

                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="text-xs text-blue-600 hover:underline"
                                        tabIndex={5}
                                    >
                                        Lupa password?
                                    </TextLink>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-none mt-1"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing ? <Spinner /> : 'Masuk'}
                            </Button>
                        </div>
                    )}
                </Form>

                {status && (
                    <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center text-xs font-medium text-emerald-700">
                        {status}
                    </div>
                )}

                {/* Footer Link */}
                <p className="mt-5 text-center text-xs text-zinc-500">
                    Belum punya akun?{' '}
                    <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Hubungi Admin
                    </a>
                </p>
            </div>
        </div>
    );
}
