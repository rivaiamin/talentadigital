<script lang='ts'>
    import { enhance } from '$app/forms';
    import ThemeToggle from '$lib/ThemeToggle.svelte';
    import { onMount } from 'svelte';

    let { form } = $props();
    let activeTab = $state<'login' | 'register'>('login');
    let isLoading = $state(false);
    let loginForm: HTMLFormElement;
    let registerForm: HTMLFormElement;

    // Form validation states
    let loginErrors = $state<Record<string, string>>({});
    let registerErrors = $state<Record<string, string>>({});

    function switchTab(tab: 'login' | 'register') {
        activeTab = tab;
        // Clear errors when switching tabs
        loginErrors = {};
        registerErrors = {};
    }

    function validateLoginForm() {
        const formData = new FormData(loginForm);
        const identity = formData.get('identity') as string;
        const password = formData.get('password') as string;
        
        loginErrors = {};
        
        if (!identity || identity.length < 3) {
            loginErrors.identity = 'Username atau nomor kontak harus minimal 3 karakter';
        }
        if (!password || password.length < 6) {
            loginErrors.password = 'Password harus minimal 6 karakter';
        }
        
        return Object.keys(loginErrors).length === 0;
    }

    function validateRegisterForm() {
        const formData = new FormData(registerForm);
        const fullName = formData.get('fullName') as string;
        const contactNumber = formData.get('contactNumber') as string;
        const password = formData.get('password') as string;
        
        registerErrors = {};
        
        if (!fullName || fullName.length < 2) {
            registerErrors.fullName = 'Nama lengkap harus minimal 2 karakter';
        }
        if (!contactNumber || contactNumber.length < 10) {
            registerErrors.contactNumber = 'Nomor kontak harus minimal 10 digit';
        }
        if (!password || password.length < 6) {
            registerErrors.password = 'Password harus minimal 6 karakter';
        }
        
        return Object.keys(registerErrors).length === 0;
    }

    function handleLoginSubmit() {
        if (!validateLoginForm()) return { cancel: true };
        isLoading = true;
    }

    function handleRegisterSubmit() {
        if (!validateRegisterForm()) return { cancel: true };
        isLoading = true;
    }

    // Reset loading state when form submission completes
    $effect(() => {
        if (form?.message) {
            isLoading = false;
        }
    });
</script>

<svelte:head>
    <title>Masuk - TalentaDigital</title>
</svelte:head>

<div class="min-h-dvh bg-base-100">
    <!-- Main content -->
    <main class="max-w-screen-sm mx-auto px-4 py-6">
        <div class="grid place-items-center min-h-[70dvh]">
            <div class="w-full max-w-md">
                <!-- Header with logo/branding -->
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-base-content mb-2">TalentaDigital</h1>
                    <p class="text-base-content/70">Bergabung dengan komunitas talenta digital</p>
                </div>

                <!-- Tab Navigation -->
                <div class="tabs tabs-boxed bg-base-200 mb-6">
                    <button 
                        class="tab tab-lg flex-1 {activeTab === 'login' ? 'tab-active' : ''}"
                        onclick={() => switchTab('login')}
                        role="tab"
                        aria-selected={activeTab === 'login'}
                        aria-controls="login-panel"
                    >
                        Masuk
                    </button>
                    <button 
                        class="tab tab-lg flex-1 {activeTab === 'register' ? 'tab-active' : ''}"
                        onclick={() => switchTab('register')}
                        role="tab"
                        aria-selected={activeTab === 'register'}
                        aria-controls="register-panel"
                    >
                        Daftar
                    </button>
                </div>

                <!-- Login Panel -->
                {#if activeTab === 'login'}
                <div 
                    id="login-panel" 
                    class="bg-base-200 rounded-xl p-8 shadow-lg border border-base-300"
                    role="tabpanel"
                    aria-labelledby="login-tab"
                >
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-semibold text-base-content mb-2">Selamat Datang Kembali</h2>
                        <p class="text-base-content/70 text-sm">Masuk ke akun Anda</p>
                    </div>
                    
                    <form 
                        bind:this={loginForm}
                        method="post" 
                        action="?/login" 
                        use:enhance={handleLoginSubmit}
                        class="space-y-5"
                    >
                        <div class="form-control">
                            <label class="label" for="identity">
                                <span class="label-text font-medium text-base-content">Username atau Nomor Kontak</span>
                            </label>
                            <input
                                id="identity"
                                name="identity"
                                type="text"
                                required
                                minlength="3"
                                maxlength="31"
                                class="input input-bordered bg-base-100 text-base-content placeholder-base-content/50 focus:ring-2 focus:ring-primary/20 {loginErrors.identity ? 'input-error' : ''}"
                                placeholder="Masukkan username atau nomor kontak"
                                aria-invalid={loginErrors.identity ? 'true' : 'false'}
                                aria-describedby={loginErrors.identity ? 'identity-error' : undefined}
                            />
                            {#if loginErrors.identity}
                                <div id="identity-error" class="label">
                                    <span class="label-text-alt text-error">{loginErrors.identity}</span>
                                </div>
                            {/if}
                        </div>
                        
                        <div class="form-control">
                            <label class="label" for="login-password">
                                <span class="label-text font-medium text-base-content">Kata sandi</span>
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                name="password"
                                required
                                minlength="6"
                                maxlength="255"
                                class="input input-bordered bg-base-100 text-base-content placeholder-base-content/50 focus:ring-2 focus:ring-primary/20 {loginErrors.password ? 'input-error' : ''}"
                                placeholder="Masukkan kata sandi"
                                aria-invalid={loginErrors.password ? 'true' : 'false'}
                                aria-describedby={loginErrors.password ? 'password-error' : undefined}
                            />
                            {#if loginErrors.password}
                                <div id="password-error" class="label">
                                    <span class="label-text-alt text-error">{loginErrors.password}</span>
                                </div>
                            {/if}
                        </div>
                        
                        <button 
                            class="btn btn-primary btn-lg rounded-full w-full {isLoading ? 'loading' : ''}" 
                            type="submit"
                            disabled={isLoading}
                        >
                            {#if isLoading}
                                <span class="loading loading-spinner loading-sm"></span>
                                Memproses...
                            {:else}
                                Masuk
                            {/if}
                        </button>
                    </form>
                </div>
                {/if}

                <!-- Register Panel -->
                {#if activeTab === 'register'}
                <div 
                    id="register-panel" 
                    class="bg-base-200 rounded-xl p-8 shadow-lg border border-base-300"
                    role="tabpanel"
                    aria-labelledby="register-tab"
                >
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-semibold text-base-content mb-2">Buat Akun Baru</h2>
                        <p class="text-base-content/70 text-sm">Bergabung dengan komunitas kami</p>
                    </div>
                    
                    <form 
                        bind:this={registerForm}
                        method="post" 
                        action="?/register" 
                        use:enhance={handleRegisterSubmit}
                        class="space-y-5"
                    >
                        <div class="form-control">
                            <label class="label" for="fullName">
                                <span class="label-text font-medium text-base-content">Nama lengkap</span>
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                minlength="2"
                                maxlength="100"
                                class="input input-bordered bg-base-100 text-base-content placeholder-base-content/50 focus:ring-2 focus:ring-primary/20 {registerErrors.fullName ? 'input-error' : ''}"
                                placeholder="Masukkan nama lengkap"
                                aria-invalid={registerErrors.fullName ? 'true' : 'false'}
                                aria-describedby={registerErrors.fullName ? 'fullname-error' : undefined}
                            />
                            {#if registerErrors.fullName}
                                <div id="fullname-error" class="label">
                                    <span class="label-text-alt text-error">{registerErrors.fullName}</span>
                                </div>
                            {/if}
                        </div>
                        
                        <div class="form-control">
                            <label class="label" for="contactNumber">
                                <span class="label-text font-medium text-base-content">Nomor Kontak</span>
                            </label>
                            <input
                                id="contactNumber"
                                name="contactNumber"
                                type="tel"
                                required
                                minlength="10"
                                maxlength="15"
                                class="input input-bordered bg-base-100 text-base-content placeholder-base-content/50 focus:ring-2 focus:ring-primary/20 {registerErrors.contactNumber ? 'input-error' : ''}"
                                placeholder="Masukkan nomor kontak (contoh: 08123456789)"
                                aria-invalid={registerErrors.contactNumber ? 'true' : 'false'}
                                aria-describedby={registerErrors.contactNumber ? 'contact-error' : undefined}
                            />
                            {#if registerErrors.contactNumber}
                                <div id="contact-error" class="label">
                                    <span class="label-text-alt text-error">{registerErrors.contactNumber}</span>
                                </div>
                            {/if}
                        </div>
                        
                        <div class="form-control">
                            <label class="label" for="register-password">
                                <span class="label-text font-medium text-base-content">Kata sandi</span>
                            </label>
                            <input
                                id="register-password"
                                type="password"
                                name="password"
                                required
                                minlength="6"
                                maxlength="255"
                                class="input input-bordered bg-base-100 text-base-content placeholder-base-content/50 focus:ring-2 focus:ring-primary/20 {registerErrors.password ? 'input-error' : ''}"
                                placeholder="Masukkan kata sandi"
                                aria-invalid={registerErrors.password ? 'true' : 'false'}
                                aria-describedby={registerErrors.password ? 'register-password-error' : undefined}
                            />
                            {#if registerErrors.password}
                                <div id="register-password-error" class="label">
                                    <span class="label-text-alt text-error">{registerErrors.password}</span>
                                </div>
                            {/if}
                        </div>
                        
                        <button 
                            class="btn btn-lg rounded-full w-full bg-base-content text-primary border border-primary hover:bg-primary hover:text-primary-content {isLoading ? 'loading' : ''}" 
                            type="submit"
                            disabled={isLoading}
                        >
                            {#if isLoading}
                                <span class="loading loading-spinner loading-sm"></span>
                                Memproses...
                            {:else}
                                Daftar
                            {/if}
                        </button>
                    </form>
                </div>
                {/if}

                <!-- Additional links and messages -->
                <div class="text-center space-y-4 mt-6">
                    {#if activeTab === 'login'}
                        <a href="/auth/password" class="link link-content text-sm hover:link-hover">
                            Lupa kata sandi?
                        </a>
                    {/if}
                    
                    {#if form?.message}
                        <div class="alert alert-error">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="text-sm">{form.message}</span>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </main>
</div>