<script lang='ts'>
    import { enhance } from '$app/forms';
    import ThemeToggle from '$lib/ThemeToggle.svelte';
    let { form } = $props();
</script>

<svelte:head>
    <title>Masuk - TalentaDigital</title>
</svelte:head>

<div class="min-h-dvh bg-base-100">
    <!-- Header with theme toggle -->
    <header class="sticky top-0 z-50 bg-base-100/80 backdrop-blur border-b border-base-300">
        <div class="max-w-screen-sm mx-auto px-4 py-3 flex justify-between items-center">
            <h1 class="text-xl font-semibold text-base-content">TalentaDigital</h1>
            <ThemeToggle />
        </div>
    </header>

    <!-- Main content -->
    <main class="max-w-screen-sm mx-auto px-4 py-6">
        <div class="grid place-items-center min-h-[70dvh]">
            <div class="w-full max-w-md space-y-8">
                <!-- Login Section -->
                <div class="bg-base-200 rounded-lg p-6 shadow-sm">
                    <h2 class="text-2xl font-semibold text-base-content mb-6 text-center">Masuk</h2>
                    <form method="post" action="?/login" use:enhance class="space-y-4">
                        <div class="form-control">
                            <label class="label" for="username">
                                <span class="label-text text-base-content">Nama pengguna</span>
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                minlength="3"
                                maxlength="31"
                                pattern="[a-z0-9_-]+"
                                class="input input-bordered bg-base-100 text-base-content placeholder-base-content/50"
                                placeholder="Masukkan nama pengguna"
                            />
                        </div>
                        <div class="form-control">
                            <label class="label" for="login-password">
                                <span class="label-text text-base-content">Kata sandi</span>
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                name="password"
                                required
                                minlength="6"
                                maxlength="255"
                                class="input input-bordered bg-base-100 text-base-content placeholder-base-content/50"
                                placeholder="Masukkan kata sandi"
                            />
                        </div>
                        <button class="btn btn-primary btn-lg rounded-full w-full" type="submit">
                            Masuk
                        </button>
                    </form>
                </div>

                <!-- Register Section -->
                <div class="bg-base-200 rounded-lg p-6 shadow-sm">
                    <h2 class="text-2xl font-semibold text-base-content mb-6 text-center">Daftar Akun Baru</h2>
                    <form method="post" action="?/register" use:enhance class="space-y-4">
                        <div class="form-control">
                            <label class="label" for="fullName">
                                <span class="label-text text-base-content">Nama lengkap</span>
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                minlength="2"
                                maxlength="100"
                                class="input input-bordered bg-base-100 text-base-content placeholder-base-content/50"
                                placeholder="Masukkan nama lengkap"
                            />
                        </div>
                        <div class="form-control">
                            <label class="label" for="register-password">
                                <span class="label-text text-base-content">Kata sandi</span>
                            </label>
                            <input
                                id="register-password"
                                type="password"
                                name="password"
                                required
                                minlength="6"
                                maxlength="255"
                                class="input input-bordered bg-base-100 text-base-content placeholder-base-content/50"
                                placeholder="Masukkan kata sandi"
                            />
                        </div>
                        <button class="btn btn-lg rounded-full w-full bg-base-content text-primary border border-primary hover:bg-primary hover:text-primary-content" type="submit">
                            Daftar
                        </button>
                    </form>
                </div>

                <!-- Additional links -->
                <div class="text-center space-y-2">
                    <a href="/auth/password" class="link link-primary text-sm">
                        Ubah kata sandi
                    </a>
                    {#if form?.message}
                        <div class="alert alert-error mt-4">
                            <span class="text-sm">{form.message}</span>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </main>
</div>


