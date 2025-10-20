<script lang='ts'>
    import { enhance } from '$app/forms';
    let { data, form } = $props();
</script>

<h1 class="text-2xl font-semibold">Halo, {data.user.fullName || data.user.username}!</h1>
<p class="text-sm text-zinc-600 dark:text-zinc-400">Username: {data.user.username} • ID: {data.user.id}</p>

<form method='post' action='?/logout' use:enhance class="mt-4">
    <button class="bg-zinc-900 text-white px-3 py-2 rounded dark:bg-zinc-100 dark:text-zinc-900">Keluar</button>
    <a class="ml-3 text-blue-700 underline" href="/auth/password">Ubah kata sandi</a>
</form>

<h2 class="mt-6 font-semibold">Profil</h2>
<form method='post' action='?/update' use:enhance class="mt-4 space-y-4 rounded-lg border border-zinc-200 p-4 shadow-sm dark:border-zinc-800">
    <label>
        Nama lengkap
        <input name='fullName' value={data.user.fullName || ''} required minlength='2' maxlength='100' class="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </label>
    <label>
        Username
        <input name='username' value={data.user.username} minlength='3' maxlength='31' pattern='[a-z0-9_-]+' class="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </label>
    <label>
        Usia
        <input name='age' type='number' min='0' max='130' value={data.user.age || ''} class="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </label>
    <button class="ml-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Simpan</button>
</form>
<p style='color: red'>{form?.message ?? ''}</p>


