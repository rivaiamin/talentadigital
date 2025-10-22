<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	
	let { data, form } = $props<{ data: PageData; form: ActionData }>();
	
	// Filter images that need thumbnails
	const imagesNeedingThumbnails = data.existingImages.filter((img: any) => img.needsThumbnails);
	const imagesWithThumbnails = data.existingImages.filter((img: any) => !img.needsThumbnails);
	
	// Group images by user
	const imagesByUser = imagesNeedingThumbnails.reduce((acc: any, img: any) => {
		if (!acc[img.userId]) acc[img.userId] = [];
		acc[img.userId].push(img);
		return acc;
	}, {} as Record<string, any[]>);
</script>

<svelte:head>
	<title>Generate Thumbnails - Admin | TalentaDigital</title>
</svelte:head>

<div class="container mx-auto p-4 max-w-4xl">
	<header class="mb-6">
		<h1 class="text-3xl font-bold mb-2">🖼️ Thumbnail Generation Tool</h1>
		<p class="text-base-content/70">
			Generate responsive thumbnails for existing talent images to improve loading performance.
		</p>
	</header>

	{#if form?.results}
		<div class="alert alert-info mb-6">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
			</svg>
			<div>
				<h3 class="font-bold">{form.message}</h3>
				<div class="text-sm mt-2 max-h-60 overflow-y-auto">
					{#each form.results as result}
						<div class="font-mono text-xs">{result}</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<!-- Statistics -->
	<div class="stats stats-horizontal shadow mb-6">
		<div class="stat">
			<div class="stat-title">Total Images</div>
			<div class="stat-value text-primary">{data.existingImages.length}</div>
		</div>
		<div class="stat">
			<div class="stat-title">Need Thumbnails</div>
			<div class="stat-value text-warning">{imagesNeedingThumbnails.length}</div>
		</div>
		<div class="stat">
			<div class="stat-title">Already Optimized</div>
			<div class="stat-value text-success">{imagesWithThumbnails.length}</div>
		</div>
		<div class="stat">
			<div class="stat-title">Total Talents</div>
			<div class="stat-value text-info">{data.talents.length}</div>
		</div>
	</div>

	{#if imagesNeedingThumbnails.length > 0}
		<!-- Generate All Thumbnails -->
		<section class="card bg-base-100 shadow-xl mb-6">
			<div class="card-body">
				<h2 class="card-title">🚀 Generate All Thumbnails</h2>
				<p class="text-base-content/70 mb-4">
					Generate responsive thumbnails for all {imagesNeedingThumbnails.length} images that need optimization.
				</p>
				<form method="POST" action="?/generateAll" use:enhance>
					<button type="submit" class="btn btn-primary btn-lg">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
						</svg>
						Generate All Thumbnails
					</button>
				</form>
			</div>
		</section>

		<!-- Generate by User -->
		<section class="card bg-base-100 shadow-xl mb-6">
			<div class="card-body">
				<h2 class="card-title">👤 Generate by User</h2>
				<p class="text-base-content/70 mb-4">
					Generate thumbnails for a specific user's images.
				</p>
				
				<div class="grid gap-4">
					{#each Object.entries(imagesByUser) as [userId, images]}
						{@const imageList = images as any[]}
						<div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
							<div>
								<div class="font-semibold">User: {userId}</div>
								<div class="text-sm text-base-content/70">
									{imageList.length} image{imageList.length !== 1 ? 's' : ''} needing thumbnails
								</div>
								<div class="text-xs text-base-content/50 mt-1">
									Files: {imageList.map((img: any) => img.filename).join(', ')}
								</div>
							</div>
							<form method="POST" action="?/generateForUser" use:enhance>
								<input type="hidden" name="userId" value={userId} />
								<button type="submit" class="btn btn-sm btn-outline">
									Generate
								</button>
							</form>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{:else}
		<!-- All images are optimized -->
		<section class="card bg-success text-success-content shadow-xl">
			<div class="card-body text-center">
				<h2 class="card-title justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					All Images Optimized!
				</h2>
				<p>All existing images already have responsive thumbnails generated.</p>
			</div>
		</section>
	{/if}

	<!-- Images with thumbnails -->
	{#if imagesWithThumbnails.length > 0}
		<section class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">✅ Already Optimized</h2>
				<p class="text-base-content/70 mb-4">
					These {imagesWithThumbnails.length} images already have responsive thumbnails.
				</p>
				
				<div class="overflow-x-auto">
					<table class="table table-sm">
						<thead>
							<tr>
								<th>User ID</th>
								<th>Filename</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{#each imagesWithThumbnails as image}
								<tr>
									<td class="font-mono text-sm">{image.userId}</td>
									<td class="font-mono text-xs">{image.filename}</td>
									<td>
										<span class="badge badge-success badge-sm">Optimized</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	{/if}

	<!-- Help section -->
	<section class="card bg-base-100 shadow-xl mt-6">
		<div class="card-body">
			<h2 class="card-title">ℹ️ How it works</h2>
			<div class="space-y-2 text-sm">
				<p>• <strong>Responsive Images:</strong> Generates 3 sizes: thumbnail (128x128), medium (400x400), and full (800x800)</p>
				<p>• <strong>WebP Format:</strong> Converts all images to WebP for better compression</p>
				<p>• <strong>Database Update:</strong> Updates talent records to use the new full-size URL</p>
				<p>• <strong>Performance:</strong> Reduces image download sizes by 60-80%</p>
				<p>• <strong>Browser Optimization:</strong> Enables browsers to choose the most appropriate image size</p>
			</div>
		</div>
	</section>
</div>