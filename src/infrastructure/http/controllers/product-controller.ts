import type { CreateProduct } from '@/application/usecases/product/create-product'
import type { DeleteProduct } from '@/application/usecases/product/delete-product'
import type { UpdateProduct } from '@/application/usecases/product/update-product'
import type { ProductCategory } from '@/domain/enums'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { HttpStatusCode } from '../helper'

interface CreateProductInput {
	name: string
	price: number
	description: string
	category: ProductCategory
}

interface UpdateProductInput extends Partial<CreateProductInput> {
	productId: string
}

export class ProductController {
	constructor(
		private readonly createProductUseCase: CreateProduct,
		private readonly deleteProductUseCase: DeleteProduct,
		private readonly updateProductUseCase: UpdateProduct
	) {}

	async createProduct(request: FastifyRequest, reply: FastifyReply) {
		const input = request.body as CreateProductInput
		const result = await this.createProductUseCase.execute(input)
		return reply.status(HttpStatusCode.CREATED).send(result.toJSON())
	}

	async deleteProduct(request: FastifyRequest, reply: FastifyReply) {
		const input = request.params as { id: string }
		await this.deleteProductUseCase.execute(input.id)
		return reply.status(HttpStatusCode.NO_CONTENT).send()
	}

	async updateProduct(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string }
		const body = request.body as Partial<CreateProductInput>
		const input: UpdateProductInput = { ...body, productId: id }
		const result = await this.updateProductUseCase.execute(input)
		return reply.status(HttpStatusCode.OK).send(result.toJSON())
	}
}
